// export const config = {
//   name: 'Kusama Validator Resource Center',
//   nodeWs: 'wss://kusama-rpc.polkadot.io',
//   denom: 'KSM',
//   addressPrefix: 2,
//   historySize: 28, // 1 week
//   polkascanAPI: 'https://explorer-31.polkascan.io/kusama/api/v1', // no trailing slash
//   theme: '@/assets/scss/themes/kusama.scss',
//   logo: 'kusama-logo.svg',
//   favicon: 'kusama-favicon.ico',
//   baseURL: '/kusama-validator-resource-center/',
// }

// polkadot
export const config = {
  name: 'Polkadot Validator Resource Center',
  nodeWs: 'wss://rpc.polkadot.io',
  denom: 'DOT',
  addressPrefix: 1,
  historySize: 7, // 1 week
  polkascanAPI: 'https://explorer-31.polkascan.io/polkadot/api/v1', // no trailing slash
  theme: '@/assets/scss/themes/polkadot.scss',
  logo: 'polkadot-logo.svg',
  favicon: 'polkadot-favicon.ico',
  baseURL: '/kusama-validator-resource-center/',
}
