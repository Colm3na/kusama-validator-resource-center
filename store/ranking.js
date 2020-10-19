import { ApiPromise, WsProvider } from '@polkadot/api'

export const state = () => ({
  list: [],
  eraHistory: [],
  loading: true,
})

export const mutations = {
  update(state, ranking, eraHistory) {
    state.list = ranking
    state.loading = false
    state.eraHistory = eraHistory
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
      validatorAddresses,
      waitingInfo,
      nominators,
      councilVotes,
      erasPoints,
      erasPreferences,
      erasSlashes,
    ] = await Promise.all([
      api.query.session.validators(),
      api.derive.staking.waitingInfo(),
      api.query.staking.nominators.entries(),
      api.derive.council.votes(),
      api.derive.staking._erasPoints(eraIndexes),
      api.derive.staking._erasPrefs(eraIndexes),
      api.derive.staking._erasSlashes(eraIndexes),
    ])

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

      // slash
      const slashed = erasSlashes.some(
        ({ validators }) => validators[validator.accountId]
      )
      const slashes =
        erasSlashes.filter(
          ({ validators }) => validators[validator.accountId]
        ) || []

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

      // governance
      const councilBacking = councilVotes.some(
        (vote) => vote[0] === validator.accountId
      )

      // era points
      const eraPointsHistory = []
      erasPoints.forEach(({ validators }) => {
        if (validators[validator.accountId]) {
          eraPointsHistory.push(validators[validator.accountId])
        } else {
          eraPointsHistory.push(null)
        }
      })

      // frecuency of payouts
      const claimedRewards = JSON.parse(
        JSON.stringify(validator.stakingLedger.claimedRewards)
      )
      const payoutHistory =
        JSON.parse(JSON.stringify(eraIndexes)).map((eraIndex) =>
          claimedRewards.some((claimedEra) => claimedEra === eraIndex)
        ) || []

      return {
        active: true,
        name,
        identity,
        hasSubIdentity,
        verifiedIdentity,
        identityRating,
        stashAddress: validator.accountId.toHuman(),
        nominators: validator.exposure.others.length,
        commission: (validator.validatorPrefs.commission / 10000000).toFixed(1),
        commissionHistory,
        eraPointsHistory,
        slashed,
        slashes,
        councilBacking,
        payoutHistory,
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

      // nominations
      intention.stakers = nominations
        .filter((nomination) =>
          nomination.targets.some(
            (target) => target === intention.accountId.toString()
          )
        )
        .map((nomination) => nomination.nominator)

      // slashes
      const slashed = erasSlashes.some(
        ({ validators }) => validators[intention.accountId]
      )
      const slashes =
        erasSlashes.filter(
          ({ validators }) => validators[intention.accountId]
        ) || []

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

      // era points
      const eraPointsHistory = []
      erasPoints.forEach(({ validators }) => {
        if (validators[intention.accountId]) {
          eraPointsHistory.push(validators[intention.accountId])
        } else {
          eraPointsHistory.push(null)
        }
      })

      // governance
      const councilBacking = councilVotes.some(
        (vote) => vote[0] === intention.accountId
      )

      // frecuency of payouts
      const claimedRewards = JSON.parse(
        JSON.stringify(intention.stakingLedger.claimedRewards)
      )
      const payoutHistory =
        eraIndexes.map((eraIndex) =>
          claimedRewards.some((claimedEra) => claimedEra === eraIndex)
        ) || []

      return {
        active: false,
        name,
        identity,
        hasSubIdentity,
        verifiedIdentity,
        identityRating,
        stashAddress: intention.accountId,
        nominators: intention.stakers.length,
        commission: (intention.validatorPrefs.commission / 10000000).toFixed(0),
        commissionHistory,
        eraPointsHistory,
        slashed,
        slashes,
        councilBacking,
        payoutHistory,
      }
    })
    const ranking = validators.concat(intentions).map((validator, index) => {
      return {
        rank: index + 1,
        ...validator,
      }
    })

    console.log(JSON.parse(JSON.stringify(ranking)))
    context.commit('update', ranking, eraIndexes)
    const endTime = new Date().getTime()
    // eslint-disable-next-line
    console.log(
      `data collection time: ${((endTime - startTime) / 1000).toFixed(2)}s`
    )
  },
}

function isVerifiedIdentity(identity) {
  const judgements = identity.judgements.filter(
    ([, judgement]) => !judgement.isFeePaid
  )
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
