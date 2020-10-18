import { ApiPromise, WsProvider } from '@polkadot/api'

export const state = () => ({
  list: [],
  loading: true,
})

export const mutations = {
  update(state, ranking) {
    state.list = ranking
    state.loading = false
  },
}

export const actions = {
  async update(context) {
    const startTime = new Date().getTime()
    const nodeWs = 'wss://kusama-rpc.polkadot.io'
    const wsProvider = new WsProvider(nodeWs)
    const api = await ApiPromise.create({ provider: wsProvider })

    // number of eras to look for
    const historySize = 5
    const withActive = false
    const erasHistoric = await api.derive.staking.erasHistoric(withActive)
    const eraIndex = erasHistoric.slice(
      Math.max(erasHistoric.length - historySize, 0)
    )
    // parallelize as much as possible
    const [
      validatorAddresses,
      waitingInfo,
      nominators,
      erasPoints,
      erasPreferences,
      erasSlashes,
    ] = await Promise.all([
      api.query.session.validators(),
      api.derive.staking.waitingInfo(),
      api.query.staking.nominators.entries(),
      api.derive.staking._erasPoints(eraIndex),
      api.derive.staking._erasPrefs(eraIndex),
      api.derive.staking._erasSlashes(eraIndex),
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
      validator = JSON.parse(JSON.stringify(validator))
      return {
        active: true,
        name: getName(validator.identity),
        verifiedIdentity,
        identity: JSON.parse(JSON.stringify(validator.identity)),
        stashAddress: validator.accountId,
        nominators: validator.exposure.others.length,
        commission: (validator.validatorPrefs.commission / 10000000).toFixed(0),
        slashed,
        slashes,
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
      const slash =
        erasSlashes.find(({ validators }) => validators[intention.accountId]) ||
        {}
      return {
        active: false,
        name: getName(intention.identity),
        verifiedIdentity,
        identity: JSON.parse(JSON.stringify(intention.identity)),
        stashAddress: intention.accountId,
        nominators: intention.stakers.length,
        commission: (intention.validatorPrefs.commission / 10000000).toFixed(0),
        slashed,
        slash,
      }
    })
    const ranking = validators.concat(intentions).map((validator, index) => {
      return {
        rank: index + 1,
        ...validator,
      }
    })

    console.log(JSON.parse(JSON.stringify(ranking)))
    context.commit('update', ranking)
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
