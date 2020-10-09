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

    //
    // validators
    //

    const [validatorAddresses, waitingInfo, nominators] = await Promise.all([
      api.query.session.validators(),
      api.derive.staking.waitingInfo(),
      api.query.staking.nominators.entries(),
    ])
    const validatorStaking = await Promise.all(
      validatorAddresses.map((authorityId) =>
        api.derive.staking.account(authorityId)
      )
    )
    for (let i = 0; i < validatorStaking.length; i++) {
      const validator = validatorStaking[i]
      const { identity } = await api.derive.accounts.info(validator.accountId)
      const judgements = identity.judgements.filter(
        ([, judgement]) => !judgement.isFeePaid
      )
      validator.identity = identity
      validator.verifiedIdentity =
        judgements.some(
          ([, judgement]) => judgement.isKnownGood || judgement.isReasonable
        ) || false
    }
    const validators = JSON.parse(JSON.stringify(validatorStaking)).map(
      (validator) => {
        return {
          active: true,
          name: getName(validator.identity),
          verifiedIdentity: validator.verifiedIdentity,
          stashAddress: validator.accountId,
          nominators: validator.exposure.others.length,
          commission: (validator.validatorPrefs.commission / 10000000).toFixed(
            0
          ),
        }
      }
    )

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
    const intentionStaking = JSON.parse(JSON.stringify(waitingInfo.info))
    for (let i = 0; i < intentionStaking.length; i++) {
      const intention = intentionStaking[i]
      intention.stakers = nominations
        .filter((nomination) =>
          nomination.targets.some(
            (target) => target === intention.accountId.toString()
          )
        )
        .map((nomination) => nomination.nominator)
      const { identity } = await api.derive.accounts.info(intention.accountId)
      const judgements = identity.judgements.filter(
        ([, judgement]) => !judgement.isFeePaid
      )
      intention.identity = identity
      intention.verifiedIdentity =
        judgements.some(
          ([, judgement]) => judgement.isKnownGood || judgement.isReasonable
        ) || false
    }
    const intentions = intentionStaking.map((intention) => {
      return {
        active: false,
        name: getName(intention.identity),
        verifiedIdentity: intention.verifiedIdentity,
        stashAddress: intention.accountId,
        nominators: intention.stakers.length,
        commission: (intention.validatorPrefs.commission / 10000000).toFixed(0),
      }
    })
    const ranking = validators.concat(intentions).map((validator, index) => {
      return {
        rank: index + 1,
        ...validator,
      }
    })

    // console.log(JSON.parse(JSON.stringify(ranking)))
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
