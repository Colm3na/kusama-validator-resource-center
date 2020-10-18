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
      const judgements = validator.identity.judgements.filter(
        ([, judgement]) => !judgement.isFeePaid
      )
      const verifiedIdentity =
        judgements.some(
          ([, judgement]) => judgement.isKnownGood || judgement.isReasonable
        ) || false

      const slashed = erasSlashes.some(
        ({ validators }) => validators[validator.accountId]
      )

      const slashes =
        erasSlashes.filter(
          ({ validators }) => validators[validator.accountId]
        ) || []

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

      const councilBacking = councilVotes.some(
        (vote) => vote[0] === validator.accountId
      )

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

      validator = JSON.parse(JSON.stringify(validator))
      return {
        active: true,
        name: getName(validator.identity),
        hasSubIdentity: hasSubIdentity(validator.identity),
        verifiedIdentity,
        identity: JSON.parse(JSON.stringify(validator.identity)),
        stashAddress: validator.accountId,
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
      intention.stakers = nominations
        .filter((nomination) =>
          nomination.targets.some(
            (target) => target === intention.accountId.toString()
          )
        )
        .map((nomination) => nomination.nominator)
      const judgements = intention.identity.judgements.filter(
        ([, judgement]) => !judgement.isFeePaid
      )
      const verifiedIdentity =
        judgements.some(
          ([, judgement]) => judgement.isKnownGood || judgement.isReasonable
        ) || false
      const slashed = erasSlashes.some(
        ({ validators }) => validators[intention.accountId]
      )
      const slashes =
        erasSlashes.filter(
          ({ validators }) => validators[intention.accountId]
        ) || []

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

      const eraPointsHistory = []
      erasPoints.forEach(({ validators }) => {
        if (validators[intention.accountId]) {
          eraPointsHistory.push(validators[intention.accountId])
        } else {
          eraPointsHistory.push(null)
        }
      })

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
        name: getName(intention.identity),
        hasSubIdentity: hasSubIdentity(intention.identity),
        verifiedIdentity,
        identity: JSON.parse(JSON.stringify(intention.identity)),
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

function hasSubIdentity(identity) {
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
