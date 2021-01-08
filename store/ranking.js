import { ApiPromise, WsProvider } from '@polkadot/api'
import { BigNumber } from 'bignumber.js'
import { BToast } from 'bootstrap-vue'
import { config } from '@/config.js'

export const state = () => ({
  list: [],
  eraHistory: [],
  blockHeight: 0,
  eraPointsHistoryTotalsSum: 0,
  eraPointsAverage: 0,
  loading: true,
  selectedAddresses: [],
})

export const mutations = {
  update(
    state,
    {
      ranking,
      eraHistory,
      blockHeight,
      eraPointsHistoryTotalsSum,
      eraPointsAverage,
    }
  ) {
    state.list = ranking
    state.loading = false
    state.eraHistory = eraHistory.map((era) => parseInt(era.toString()))
    state.blockHeight = blockHeight
    state.eraPointsHistoryTotalsSum = eraPointsHistoryTotalsSum
    state.eraPointsAverage = eraPointsAverage
  },
  loadSelected(state) {
    const selectedAddresses =
      this.$cookies.get(`${config.name}-selectedValidatorAddresses`) || []
    state.selectedAddresses = selectedAddresses
  },
  toggleSelected(state, { accountId }) {
    const selectedAddresses = state.selectedAddresses
    if (selectedAddresses.includes(accountId)) {
      selectedAddresses.splice(state.selectedAddresses.indexOf(accountId), 1)
    } else if (selectedAddresses.length < 16) {
      // check if a member of the same cluster is already in the set
      const validator = state.list.find(
        ({ stashAddress }) => accountId === stashAddress
      )
      const clusterMemberAlreadyIncluded = state.list
        .filter(({ stashAddress }) =>
          state.selectedAddresses.includes(stashAddress)
        )
        .some(
          ({ clusterName, partOfCluster }) =>
            partOfCluster && clusterName === validator.clusterName
        )
      if (clusterMemberAlreadyIncluded) {
        const bootStrapToaster = new BToast()
        bootStrapToaster.$bvToast.toast(
          'Selecting more than one member of a cluster is not recommended',
          {
            title: 'Cluster already included!',
            variant: 'warning',
            autoHideDelay: 5000,
            appendToast: false,
          }
        )
      }
      selectedAddresses.push(accountId)
    } else {
      const bootStrapToaster = new BToast()
      bootStrapToaster.$bvToast.toast(
        'Please remove before selecting a new one',
        {
          title: 'Select up to 16 validators',
          variant: 'danger',
          autoHideDelay: 5000,
          appendToast: false,
        }
      )
    }
    state.selectedAddresses = selectedAddresses
    this.$cookies.set(
      `${config.name}-selectedValidatorAddresses`,
      selectedAddresses,
      {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      }
    )
  },
}

export const actions = {
  async update(context) {
    const startTime = new Date().getTime()

    //
    // data collection
    //
    const wsProvider = new WsProvider(config.nodeWs)
    const api = await ApiPromise.create({ provider: wsProvider })
    const withActive = false
    const erasHistoric = await api.derive.staking.erasHistoric(withActive)
    const eraIndexes = erasHistoric.slice(
      Math.max(erasHistoric.length - config.historySize, 0)
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
      proposals,
      referendums,
      maxNominatorRewardedPerValidator,
    ] = await Promise.all([
      api.rpc.chain.getBlock(),
      api.query.session.validators(),
      api.derive.staking.waitingInfo(),
      api.query.staking.nominators.entries(),
      api.derive.council.votes(),
      api.derive.staking._erasPoints(eraIndexes),
      api.derive.staking._erasPrefs(eraIndexes),
      api.derive.staking._erasSlashes(eraIndexes),
      api.derive.democracy.proposals(),
      api.derive.democracy.referendums(),
      api.consts.staking.maxNominatorRewardedPerValidator,
    ])
    validators = await Promise.all(
      validatorAddresses.map((authorityId) =>
        api.derive.staking.query(authorityId, {
          withDestination: false,
          withExposure: true,
          withLedger: true,
          withNominations: false,
          withPrefs: true,
        })
      )
    )
    validators = await Promise.all(
      validators.map((validator) =>
        api.derive.accounts.info(validator.accountId).then(({ identity }) => {
          return {
            ...validator,
            identity,
            active: true,
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
            active: false,
          }
        })
      )
    )
    // api.disconnect()
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
    const erasPointsJSON = JSON.parse(JSON.stringify(erasPoints))
    const eraPointsAverage = eraPointsHistoryTotalsSum / numActiveValidators
    const nominations = nominators.map(([key, nominations]) => {
      const nominator = key.toHuman()[0]
      const targets = nominations.toHuman().targets
      return {
        nominator,
        targets,
      }
    })
    const participateInGovernance = []
    proposals.forEach(({ seconds, proposer }) => {
      participateInGovernance.push(proposer.toString())
      seconds.forEach((accountId) =>
        participateInGovernance.push(accountId.toString())
      )
    })
    referendums.forEach(({ votes }) => {
      votes.forEach(({ accountId }) =>
        participateInGovernance.push(accountId.toString())
      )
    })
    validators = validators.concat(intentions)
    const ranking = validators
      .map((validator) => {
        // active
        const active = validator.active
        const activeRating = active ? 2 : 0

        // stash
        const stashAddress = validator.stashId.toString()

        // controller
        const controllerAddress = validator.controllerId.toString()

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
          validators,
          validator.identity
        )
        const partOfCluster = clusterMembers > 1
        const clusterName = getClusterName(validator.identity)
        const subAccountsRating = hasSubIdentity ? 2 : 0

        // nominators
        const nominators = active
          ? validator.exposure.others.length
          : nominations.filter((nomination) =>
              nomination.targets.some(
                (target) => target === validator.accountId.toString()
              )
            ).length
        const nominatorsRating =
          nominators > 0 && nominators <= maxNominatorRewardedPerValidator
            ? 2
            : 0

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
        const councilBacking = validator.identity?.parent
          ? councilVotes.some(
              (vote) => vote[0].toString() === validator.accountId.toString()
            ) ||
            councilVotes.some(
              (vote) =>
                vote[0].toString() === validator.identity.parent.toString()
            )
          : councilVotes.some(
              (vote) => vote[0].toString() === validator.accountId.toString()
            )
        const activeInGovernance = validator.identity?.parent
          ? participateInGovernance.includes(validator.accountId.toString()) ||
            participateInGovernance.includes(
              validator.identity.parent.toString()
            )
          : participateInGovernance.includes(validator.accountId.toString())
        const governanceRating =
          councilBacking && activeInGovernance
            ? 3
            : councilBacking || activeInGovernance
            ? 2
            : 0

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
        const payoutHistory = []
        erasPointsJSON.forEach((eraPoints) => {
          const eraIndex = parseInt(eraPoints.era)
          let eraPayoutState = 'inactive'
          if (Object.keys(eraPoints.validators).includes(stashAddress)) {
            if (claimedRewards.includes(eraIndex)) {
              eraPayoutState = 'paid'
            } else {
              eraPayoutState = 'pending'
            }
          }
          payoutHistory.push(eraPayoutState)
        })
        const payoutRating = getPayoutRating(payoutHistory)

        // stake
        const selfStake = active
          ? new BigNumber(validator.exposure.own)
          : new BigNumber(validator.stakingLedger.total)
        const totalStake = active
          ? new BigNumber(validator.exposure.total)
          : selfStake
        const otherStake = active
          ? totalStake.minus(selfStake)
          : new BigNumber(0)

        // total rating
        const totalRating =
          activeRating +
          identityRating +
          subAccountsRating +
          nominatorsRating +
          commissionRating +
          eraPointsRating +
          slashRating +
          governanceRating +
          payoutRating

        return {
          active,
          activeRating,
          name,
          identity,
          hasSubIdentity,
          subAccountsRating,
          verifiedIdentity,
          identityRating,
          stashAddress,
          controllerAddress,
          partOfCluster,
          clusterName,
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
          activeInGovernance,
          governanceRating,
          payoutHistory,
          payoutRating,
          selfStake,
          otherStake,
          totalStake,
          totalRating,
        }
      })
      .sort((a, b) => (a.totalRating < b.totalRating ? 1 : -1))
      .map((validator, rank) => {
        return {
          rank: rank + 1,
          ...validator,
        }
      })
    // console.log(JSON.parse(JSON.stringify(ranking)))
    context.commit('update', {
      ranking,
      eraHistory: eraIndexes,
      blockHeight,
      eraPointsHistoryTotalsSum,
      eraPointsAverage,
    })
    const endTime = new Date().getTime()
    const dataProcessingTime = endTime - dataCollectionEndTime
    // eslint-disable-next-line
    console.log(
      `data processing time: ${(dataProcessingTime / 1000).toFixed(3)}s`
    )
    // eslint-disable-next-line
    console.log(
      `total time: ${((dataCollectionTime + dataProcessingTime) / 1000).toFixed(
        3
      )}s`
    )
  },
  loadSelected(context) {
    context.commit('loadSelected')
  },
  toggleSelected(context, accountId) {
    context.commit('toggleSelected', accountId)
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

function getClusterName(identity) {
  return identity.displayParent || null
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
  const pendingEras = payoutHistory.filter((era) => era === 'pending').length
  if (pendingEras <= config.erasPerDay) {
    return 3
  } else if (pendingEras <= 3 * config.erasPerDay) {
    return 2
  } else if (pendingEras < 7 * config.erasPerDay) {
    return 1
  }
  return 0
}

function getClusterMembers(hasSubIdentity, validators, validatorIdentity) {
  if (!hasSubIdentity) {
    return 0
  }
  return validators.filter(
    ({ identity }) => identity.displayParent === validatorIdentity.displayParent
  ).length
}
