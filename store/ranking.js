import { ApiPromise, WsProvider } from '@polkadot/api'

export const state = () => ({
  list: [],
})

export const mutations = {
  update(state, ranking) {
    state.list = ranking
  },
}

export const actions = {
  async update(context) {
    const nodeWs = 'wss://kusama.polkastats.io/rpc'
    const wsProvider = new WsProvider(nodeWs)
    const api = await ApiPromise.create({ provider: wsProvider })
    const validatorAddresses = await api.query.session.validators()
    const validatorStaking = await Promise.all(
      validatorAddresses.map((authorityId) =>
        api.derive.staking.account(authorityId)
      )
    )
    console.log(JSON.parse(JSON.stringify(validatorStaking)))
    context.commit('update', JSON.parse(JSON.stringify(validatorStaking)))
  },
}
