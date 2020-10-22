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
    const nodeWs = 'wss://kusama-rpc.polkadot.io'
    const wsProvider = new WsProvider(nodeWs)
    const api = await ApiPromise.create({ provider: wsProvider })

    const historySize = 28 // 1 week
    const withActive = false
    const erasHistoric = await api.derive.staking.erasHistoric(withActive)
    const eraIndexes = erasHistoric.slice(
      Math.max(erasHistoric.length - historySize, 0)
    )
    // parallelize as much as possible
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
    const blockHeight = parseInt(block.header.number.toString())

    const eraPointsHistoryTotals = []
    erasPoints.forEach(({ eraPoints }) => {
      eraPointsHistoryTotals.push(parseInt(eraPoints.toString()))
    })
    const eraPointsHistoryTotalsSum = eraPointsHistoryTotals.reduce(
      (total, num) => total + num,
      0
    )

    //
    // validators
    //
    let validators = await Promise.all(
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
    validators = validators.map((validator) => {
      // identity
      const verifiedIdentity = isVerifiedIdentity(validator.identity)
      const hasSubIdentity = subIdentity(validator.identity)
      const identity = JSON.parse(JSON.stringify(validator.identity))
      const name = getName(validator.identity)
      const hasAllFields =
        identity.display &&
        identity.legal &&
        identity.web &&
        identity.email &&
        identity.twitter &&
        identity.riot
      const identityRating = getIdentityRating(
        name,
        verifiedIdentity,
        hasAllFields
      )

      // sub-accounts
      const clusterMembers = hasSubIdentity
        ? validators.filter(
            ({ identity }) =>
              identity.displayParent === validator.identity.displayParent
          ).length
        : 0
      const partOfCluster = clusterMembers > 0

      // nominators
      const nominators = validator.exposure.others.length
      const nominatorsRating = nominators > 0 && nominators < 128 ? 2 : 0

      // slashes
      const slashed = erasSlashes.some(
        ({ validators }) => validators[validator.accountId]
      )
      const slashes =
        erasSlashes.filter(
          ({ validators }) => validators[validator.accountId]
        ) || []

      // slashes rating
      const slashRating = slashed ? 0 : 2

      // commission
      const commissionHistory = []
      erasPreferences.forEach(({ validators }) => {
        if (validators[validator.accountId]) {
          commissionHistory.push(
            (validators[validator.accountId].commission / 10000000).toFixed(2)
          )
        } else {
          commissionHistory.push(null)
        }
      })

      // commission rating
      const commission = validator.validatorPrefs.commission / 10000000
      let commissionRating = 0
      if (commission === 100 || commission === 0) {
        commissionRating = 0
      } else if (commission > 10) {
        commissionRating = 1
      } else if (commission >= 5) {
        if (
          commissionHistory[0] > commissionHistory[commissionHistory.length - 1]
        ) {
          commissionRating = 3
        }
        commissionRating = 2
      } else if (commission < 5) {
        commissionRating = 3
      }

      // governance
      const councilBacking = councilVotes.some(
        (vote) => vote[0].toString() === validator.accountId.toString()
      )

      // governance rating
      const governanceRating = councilBacking ? 2 : 0

      // era points
      const eraPointsHistory = []
      erasPoints.forEach(({ validators }) => {
        if (validators[validator.accountId]) {
          eraPointsHistory.push(parseInt(validators[validator.accountId]))
        } else {
          eraPointsHistory.push(null)
        }
      })

      // era points rating
      const eraPointsHistoryValidator = eraPointsHistory.reduce(
        (total, num) => total + num,
        0
      )
      const numActiveValidators = validatorAddresses.length
      const eraPointsPercent =
        (eraPointsHistoryValidator * 100) / eraPointsHistoryTotalsSum
      const eraPointsAverage = eraPointsHistoryTotalsSum / numActiveValidators
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

      // payout rating
      let payoutRating = 0
      const pendingEras = payoutHistory.filter((era) => !era).length
      if (pendingEras <= 4) {
        payoutRating = 3
      } else if (pendingEras <= 12) {
        payoutRating = 2
      } else if (pendingEras < 28) {
        payoutRating = 1
      }

      // stake
      const selfStake = new BigNumber(validator.exposure.own)
      const totalStake = new BigNumber(validator.exposure.total)
      const otherStake = totalStake.minus(selfStake)

      return {
        active: true,
        name,
        identity,
        hasSubIdentity,
        verifiedIdentity,
        identityRating,
        stashAddress: validator.accountId.toHuman(),
        partOfCluster,
        clusterMembers,
        nominators,
        nominatorsRating,
        commission: validator.validatorPrefs.commission / 10000000,
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
      }
    })

    //
    // waiting validators
    //
    const nominations = nominators.map(([key, nominations]) => {
      const nominator = key.toHuman()[0]
      const targets = nominations.toHuman().targets
      return {
        nominator,
        targets,
      }
    })
    let intentions = JSON.parse(JSON.stringify(waitingInfo.info))
    intentions = await Promise.all(
      intentions.map((intention) =>
        api.derive.accounts.info(intention.accountId).then(({ identity }) => {
          return {
            ...intention,
            identity,
          }
        })
      )
    )
    intentions = intentions.map((intention) => {
      // identity
      const verifiedIdentity = isVerifiedIdentity(intention.identity)
      const hasSubIdentity = subIdentity(intention.identity)
      const identity = JSON.parse(JSON.stringify(intention.identity))
      const name = getName(intention.identity)
      const hasAllFields =
        identity.display &&
        identity.legal &&
        identity.web &&
        identity.email &&
        identity.twitter &&
        identity.riot
      const identityRating = getIdentityRating(
        name,
        verifiedIdentity,
        hasAllFields
      )

      // sub-accounts
      const clusterMembers = hasSubIdentity
        ? validators.filter(
            ({ identity }) =>
              identity.displayParent === intention.identity.displayParent
          ).length
        : 0
      const partOfCluster = clusterMembers > 0

      // nominators
      const nominators = nominations
        .filter((nomination) =>
          nomination.targets.some(
            (target) => target === intention.accountId.toString()
          )
        )
        .map((nomination) => nomination.nominator).length
      const nominatorsRating = nominators > 0 && nominators < 128 ? 2 : 0

      // slashes
      const slashed = erasSlashes.some(
        ({ validators }) => validators[intention.accountId]
      )
      const slashes =
        erasSlashes.filter(
          ({ validators }) => validators[intention.accountId]
        ) || []
      // slashes rating
      const slashRating = slashed ? 0 : 2

      // commission
      const commissionHistory = []
      erasPreferences.forEach(({ validators }) => {
        if (validators[intention.accountId]) {
          commissionHistory.push(
            (validators[intention.accountId].commission / 10000000).toFixed(2)
          )
        } else {
          commissionHistory.push(null)
        }
      })

      // commission rating
      const commission = intention.validatorPrefs.commission / 10000000
      let commissionRating = 0
      if (commission === 100 || commission === 0) {
        commissionRating = 0
      } else if (commission > 10) {
        commissionRating = 1
      } else if (commission >= 5) {
        commissionRating = 2
      } else if (commission < 5) {
        commissionRating = 3
      }

      // era points
      const eraPointsHistory = []
      erasPoints.forEach(({ validators }) => {
        if (validators[intention.accountId]) {
          eraPointsHistory.push(validators[intention.accountId])
        } else {
          eraPointsHistory.push(null)
        }
      })

      // era points rating
      const eraPointsHistoryValidator = eraPointsHistory.reduce(
        (total, num) => total + num,
        0
      )
      const numActiveValidators = validatorAddresses.length
      const eraPointsPercent =
        (eraPointsHistoryValidator * 100) / eraPointsHistoryTotalsSum
      const eraPointsAverage = eraPointsHistoryTotalsSum / numActiveValidators
      const eraPointsRating =
        eraPointsHistoryValidator > eraPointsAverage ? 2 : 0

      // governance
      const councilBacking = councilVotes.some(
        (vote) => vote[0] === intention.accountId
      )

      // governance rating
      const governanceRating = councilBacking ? 2 : 0

      // frecuency of payouts
      const claimedRewards = JSON.parse(
        JSON.stringify(intention.stakingLedger.claimedRewards)
      )
      const payoutHistory =
        eraIndexes.map((eraIndex) =>
          claimedRewards.some((claimedEra) => claimedEra === eraIndex)
        ) || []

      // payout rating
      let payoutRating = 0
      const pendingEras = payoutHistory.filter((era) => !era).length
      if (pendingEras <= 4) {
        payoutRating = 3
      } else if (pendingEras <= 12) {
        payoutRating = 2
      } else if (pendingEras < 28) {
        payoutRating = 1
      }

      // stake
      const selfStake = new BigNumber(0)
      const totalStake = new BigNumber(0)
      const otherStake = totalStake.minus(selfStake)

      return {
        active: false,
        name,
        identity,
        hasSubIdentity,
        verifiedIdentity,
        identityRating,
        stashAddress: intention.accountId,
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
      }
    })
    const ranking = validators.concat(intentions).map((validator, index) => {
      return {
        rank: index + 1,
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
    // eslint-disable-next-line
    console.log(
      `data collection time: ${((endTime - startTime) / 1000).toFixed(2)}s`
    )
  },
}

function isVerifiedIdentity(identity) {
  if (identity.judgements.length === 0) {
    return false
  }
  const judgements = identity.judgements.filter(
    ([, judgement]) => !judgement.isFeePaid
  )
  // console.log(`judgements:`, JSON.stringify(judgements, null, 2))
  return (
    judgements.some(
      ([, judgement]) => judgement.isKnownGood || judgement.isReasonable
    ) || false
  )
}

function getName(identity) {
  if (
    identity.displayParent &&
    identity.displayParent !== `` &&
    identity.display &&
    identity.display !== ``
  ) {
    return `${identity.displayParent} / ${identity.display}`
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
