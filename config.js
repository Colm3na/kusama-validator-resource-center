export const config = {
  name: 'kusama',
  title: 'Validator resource center and ranking',
  nodeWs: 'wss://kusama-rpc.polkadot.io',
  denom: 'KSM',
  addressPrefix: 2,
  historySize: 28, // 1 week
  polkascanAPI: 'https://explorer-31.polkascan.io/kusama/api/v1', // no trailing slash
  theme: '@/assets/scss/themes/kusama.scss',
  logo: 'kusama-logo.svg',
  favicon: 'kusama-favicon.ico',
  baseURL: '/kusama-validator-resource-center/',
}

// polkadot
// export const config = {
//   name: 'polkadot',
//   title: 'Validator resource center and ranking',
//   nodeWs: 'wss://rpc.polkadot.io',
//   denom: 'DOT',
//   addressPrefix: 1,
//   historySize: 7, // 1 week
//   polkascanAPI: 'https://explorer-31.polkascan.io/polkadot/api/v1', // no trailing slash
//   theme: '@/assets/scss/themes/polkadot.scss',
//   logo: 'polkadot-logo.svg',
//   favicon: 'polkadot-favicon.ico',
//   baseURL: '/kusama-validator-resource-center/',
// }
