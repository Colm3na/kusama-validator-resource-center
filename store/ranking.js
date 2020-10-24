import { ApiPromise, WsProvider } from '@polkadot/api'
import { BigNumber } from 'bignumber.js'

export const state = () => ({
  list: [],
  eraHistory: [],
  blockHeight: 0,
  eraPointsHistoryTotals: [],
  loading: true,
})

export const mutations = {
  update(state, { ranking, eraHistory, blockHeight, eraPointsHistoryTotals }) {
    state.list = ranking
    state.loading = false
    state.eraHistory = eraHistory.map((era) => parseInt(era.toString()))
    state.blockHeight = blockHeight
    state.eraPointsHistoryTotals = eraPointsHistoryTotals
  },
}

export const actions = {
  async update(context) {
    const startTime = new Date().getTime()

    const historySize = 28 // 1 week
    const withActive = false

    //
    // data collection
    //
    const nodeWs = 'wss://kusama-rpc.polkadot.io'
    const wsProvider = new WsProvider(nodeWs)
    const api = await ApiPromise.create({ provider: wsProvider })

    const erasHistoric = await api.derive.staking.erasHistoric(withActive)
    const eraIndexes = erasHistoric.slice(
      Math.max(erasHistoric.length - historySize, 0)
    )

    let validators = []
    let intentions = []

    const [
      { block },
      validatorAddresses,
      waitingInfo,
      nominators,
      councilVotes,
      erasPoints,
      erasPreferences,
      erasSlashes,
    ] = await Promise.all([
      api.rpc.chain.getBlock(),
      api.query.session.validators(),
      api.derive.staking.waitingInfo(),
      api.query.staking.nominators.entries(),
      api.derive.council.votes(),
      api.derive.staking._erasPoints(eraIndexes),
      api.derive.staking._erasPrefs(eraIndexes),
      api.derive.staking._erasSlashes(eraIndexes),
    ])
    validators = await Promise.all(
      validatorAddresses.map((authorityId) =>
        api.derive.staking.account(authorityId)
      )
    )
    validators = await Promise.all(
      validators.map((validator) =>
        api.derive.accounts.info(validator.accountId).then(({ identity }) => {
          return {
            ...validator,
            identity,
          }
        })
      )
    )
    intentions = await Promise.all(
      JSON.parse(JSON.stringify(waitingInfo.info)).map((intention) =>
        api.derive.accounts.info(intention.accountId).then(({ identity }) => {
          return {
            ...intention,
            identity,
          }
        })
      )
    )
    api.disconnect()
    const dataCollectionEndTime = new Date().getTime()
    const dataCollectionTime = dataCollectionEndTime - startTime
    // eslint-disable-next-line
    console.log(
      `data collection time: ${(dataCollectionTime / 1000).toFixed(3)}s`
    )

    //
    // data processing
    //
    const blockHeight = parseInt(block.header.number.toString())
    const numActiveValidators = validatorAddresses.length
    const eraPointsHistoryTotals = []
    erasPoints.forEach(({ eraPoints }) => {
      eraPointsHistoryTotals.push(parseInt(eraPoints.toString()))
    })
    const eraPointsHistoryTotalsSum = eraPointsHistoryTotals.reduce(
      (total, num) => total + num,
      0
    )
    const eraPointsAverage = eraPointsHistoryTotalsSum / numActiveValidators
    const nominations = nominators.map(([key, nominations]) => {
      const nominator = key.toHuman()[0]
      const targets = nominations.toHuman().targets
      return {
        nominator,
        targets,
      }
    })
    validators = validators.map((validator) => {
      // stash
      const stashAddress = validator.stashId.toString()

      // identity
      const {
        verifiedIdentity,
        hasSubIdentity,
        name,
        identityRating,
      } = parseIdentity(validator.identity)
      const identity = JSON.parse(JSON.stringify(validator.identity))

      // sub-accounts
      const clusterMembers = getClusterMembers(
        hasSubIdentity,
        validators.concat(intentions),
        validator.identity
      )
      const partOfCluster = clusterMembers > 0
      const subAccountsRating = hasSubIdentity ? 2 : 0

      // nominators
      const nominators = validator.exposure.others.length
      const nominatorsRating = nominators > 0 && nominators < 128 ? 2 : 0

      // slashes
      const slashes =
        erasSlashes.filter(
          ({ validators }) => validators[validator.accountId]
        ) || []
      const slashed = slashes.length > 0
      const slashRating = slashed ? 0 : 2

      // commission
      const commission = validator.validatorPrefs.commission / 10000000
      const commissionHistory = getCommissionHistory(
        validator.accountId,
        erasPreferences
      )
      const commissionRating = getCommissionRating(
        commission,
        commissionHistory
      )

      // governance
      const councilBacking = councilVotes.some(
        (vote) => vote[0].toString() === validator.accountId.toString()
      )
      const governanceRating = councilBacking ? 2 : 0

      // era points
      const eraPointsHistory = []
      erasPoints.forEach(({ validators }) => {
        if (validators[validator.accountId]) {
          eraPointsHistory.push(parseInt(validators[validator.accountId]))
        } else {
          eraPointsHistory.push(0)
        }
      })
      const eraPointsHistoryValidator = eraPointsHistory.reduce(
        (total, num) => total + num,
        0
      )
      const eraPointsPercent =
        (eraPointsHistoryValidator * 100) / eraPointsHistoryTotalsSum
      const eraPointsRating =
        eraPointsHistoryValidator > eraPointsAverage ? 2 : 0

      // frecuency of payouts
      const claimedRewards = JSON.parse(
        JSON.stringify(validator.stakingLedger.claimedRewards)
      )
      const payoutHistory =
        JSON.parse(JSON.stringify(eraIndexes)).map((eraIndex) =>
          claimedRewards.some((claimedEra) => claimedEra === eraIndex)
        ) || []
      const payoutRating = getPayoutRating(payoutHistory)

      // stake
      const selfStake = new BigNumber(validator.exposure.own)
      const totalStake = new BigNumber(validator.exposure.total)
      const otherStake = totalStake.minus(selfStake)

      // total rating
      const totalRating =
        identityRating +
        subAccountsRating +
        nominatorsRating +
        commissionRating +
        eraPointsRating +
        slashRating +
        governanceRating +
        payoutRating

      return {
        active: true,
        name,
        identity,
        hasSubIdentity,
        subAccountsRating,
        verifiedIdentity,
        identityRating,
        stashAddress,
        partOfCluster,
        clusterMembers,
        nominators,
        nominatorsRating,
        commission,
        commissionHistory,
        commissionRating,
        eraPointsHistory,
        eraPointsPercent,
        eraPointsRating,
        slashed,
        slashRating,
        slashes,
        councilBacking,
        governanceRating,
        payoutHistory,
        payoutRating,
        selfStake,
        otherStake,
        totalStake,
        totalRating,
      }
    })

    //
    // waiting validators
    //
    intentions = intentions.map((intention) => {
      // stash
      const stashAddress = intention.stashId.toString()

      // identity
      const {
        verifiedIdentity,
        hasSubIdentity,
        name,
        identityRating,
      } = parseIdentity(intention.identity)
      const identity = JSON.parse(JSON.stringify(intention.identity))

      // sub-accounts
      const clusterMembers = getClusterMembers(
        hasSubIdentity,
        validators.concat(intentions),
        intention.identity
      )
      const partOfCluster = clusterMembers > 0
      const subAccountsRating = hasSubIdentity ? 2 : 0

      // nominators
      const nominators = nominations.filter((nomination) =>
        nomination.targets.some(
          (target) => target === intention.accountId.toString()
        )
      ).length
      const nominatorsRating = nominators > 0 && nominators < 128 ? 2 : 0

      // slashes
      const slashes =
        erasSlashes.filter(
          ({ validators }) => validators[intention.accountId]
        ) || []
      const slashed = slashes.length > 0

      // slashes rating
      const slashRating = slashed ? 0 : 2

      // commission
      const commissionHistory = getCommissionHistory(
        intention.accountId,
        erasPreferences
      )

      // commission rating
      const commission = intention.validatorPrefs.commission / 10000000
      const commissionRating = getCommissionRating(
        commission,
        commissionHistory
      )

      // governance
      const councilBacking = councilVotes.some(
        (vote) => vote[0] === intention.accountId
      )

      // governance rating
      const governanceRating = councilBacking ? 2 : 0

      // era points
      const eraPointsHistory = []
      erasPoints.forEach(({ validators }) => {
        if (validators[intention.accountId]) {
          eraPointsHistory.push(validators[intention.accountId])
        } else {
          eraPointsHistory.push(0)
        }
      })

      // era points rating
      const eraPointsHistoryValidator = eraPointsHistory.reduce(
        (total, num) => total + num,
        0
      )
      const eraPointsPercent =
        (eraPointsHistoryValidator * 100) / eraPointsHistoryTotalsSum
      const eraPointsRating =
        eraPointsHistoryValidator > eraPointsAverage ? 2 : 0

      // frecuency of payouts
      const claimedRewards = JSON.parse(
        JSON.stringify(intention.stakingLedger.claimedRewards)
      )
      const payoutHistory =
        JSON.parse(JSON.stringify(eraIndexes)).map((eraIndex) =>
          claimedRewards.some((claimedEra) => claimedEra === eraIndex)
        ) || []
      const payoutRating = getPayoutRating(payoutHistory)

      // stake
      const selfStake = new BigNumber(intention.stakingLedger.total)
      const totalStake = selfStake
      const otherStake = new BigNumber(0)

      // total rating
      const totalRating =
        identityRating +
        subAccountsRating +
        nominatorsRating +
        commissionRating +
        eraPointsRating +
        slashRating +
        governanceRating +
        payoutRating

      return {
        active: false,
        name,
        identity,
        hasSubIdentity,
        subAccountsRating,
        verifiedIdentity,
        identityRating,
        stashAddress,
        partOfCluster,
        clusterMembers,
        nominators,
        nominatorsRating,
        commission,
        commissionHistory,
        commissionRating,
        eraPointsHistory,
        eraPointsPercent,
        eraPointsRating,
        slashed,
        slashRating,
        slashes,
        councilBacking,
        governanceRating,
        payoutHistory,
        payoutRating,
        selfStake,
        otherStake,
        totalStake,
        totalRating,
      }
    })
    const ranking = validators
      .concat(intentions)
      .sort((a, b) => (a.totalRating < b.totalRating ? 1 : -1))
      .map((validator, rank) => {
        return {
          rank: rank + 1,
          ...validator,
        }
      })

    console.log(JSON.parse(JSON.stringify(ranking)))
    context.commit('update', {
      ranking,
      eraHistory: eraIndexes,
      blockHeight,
      eraPointsHistoryTotals,
    })
    const endTime = new Date().getTime()
    const dataProcessingTime = endTime - dataCollectionEndTime
    // eslint-disable-next-line
    console.log(
      `data processing time: ${(dataProcessingTime / 1000).toFixed(3)}s`
    )
    // eslint-disable-next-line
    console.log(
      `total time: ${((dataCollectionTime + dataProcessingTime) / 1000).toFixed(3)}s`
    )
  },
}

function isVerifiedIdentity(identity) {
  if (identity.judgements.length === 0) {
    return false
  }
  return identity.judgements
    .filter(([, judgement]) => !judgement.isFeePaid)
    .some(([, judgement]) => judgement.isKnownGood || judgement.isReasonable)
}

function getName(identity) {
  if (
    identity.displayParent &&
    identity.displayParent !== `` &&
    identity.display &&
    identity.display !== ``
  ) {
    return `${identity.displayParent}/${identity.display}`
  } else {
    return identity.display || ``
  }
}

function subIdentity(identity) {
  if (
    identity.displayParent &&
    identity.displayParent !== `` &&
    identity.display &&
    identity.display !== ``
  ) {
    return true
  }
  return false
}

function getIdentityRating(name, verifiedIdentity, hasAllFields) {
  if (verifiedIdentity && hasAllFields) {
    return 3
  } else if (verifiedIdentity && !hasAllFields) {
    return 2
  } else if (name !== '') {
    return 1
  }
  return 0
}

function parseIdentity(identity) {
  const verifiedIdentity = isVerifiedIdentity(identity)
  const hasSubIdentity = subIdentity(identity)
  const name = getName(identity)
  const hasAllFields =
    identity.display &&
    identity.legal &&
    identity.web &&
    identity.email &&
    identity.twitter &&
    identity.riot
  const identityRating = getIdentityRating(name, verifiedIdentity, hasAllFields)
  return {
    verifiedIdentity,
    hasSubIdentity,
    name,
    identityRating,
  }
}

function getCommissionHistory(accountId, erasPreferences) {
  const commissionHistory = []
  erasPreferences.forEach(({ validators }) => {
    if (validators[accountId]) {
      commissionHistory.push(
        (validators[accountId].commission / 10000000).toFixed(2)
      )
    } else {
      commissionHistory.push(null)
    }
  })
  return commissionHistory
}

function getCommissionRating(commission, commissionHistory) {
  if (commission === 100 || commission === 0) {
    return 0
  } else if (commission > 10) {
    return 1
  } else if (commission >= 5) {
    if (
      commissionHistory.length > 1 &&
      commissionHistory[0] > commissionHistory[commissionHistory.length - 1]
    ) {
      return 3
    }
    return 2
  } else if (commission < 5) {
    return 3
  }
}

function getPayoutRating(payoutHistory) {
  const pendingEras = payoutHistory.filter((era) => !era).length
  if (pendingEras <= 4) {
    return 3
  } else if (pendingEras <= 12) {
    return 2
  } else if (pendingEras < 28) {
    return 1
  }
}

function getClusterMembers(hasSubIdentity, validators, validatorIdentity) {
  if (!hasSubIdentity) {
    return 0
  }
  return validators.filter(
    ({ identity }) => identity.displayParent === validatorIdentity.displayParent
  ).length
}
