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
    const nodeWs = 'wss://kusama-rpc.polkadot.io'
    const wsProvider = new WsProvider(nodeWs)
    const api = await ApiPromise.create({ provider: wsProvider })
    const validatorAddresses = await api.query.session.validators()
    const validatorStaking = await Promise.all(
      validatorAddresses.map((authorityId) =>
        api.derive.staking.account(authorityId)
      )
    )
    for (let i = 0; i < validatorStaking.length; i++) {
      const validator = validatorStaking[i]
      const { identity } = await api.derive.accounts.info(validator.accountId)
      validator.identity = identity
    }
    // console.log(JSON.parse(JSON.stringify(validatorStaking)))
    context.commit('update', JSON.parse(JSON.stringify(validatorStaking)))
  },
}
