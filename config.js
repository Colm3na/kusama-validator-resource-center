export const config = {
  name: 'kusama',
  title: 'Validator resource center and ranking',
  nodeWs: 'wss://kusama-rpc.polkadot.io',
  denom: 'KSM',
  addressPrefix: 2,
  tokenDecimals: 12,
  historySize: 28, // 1 week
  erasPerDay: 4,
  polkascanAPI: 'https://explorer-31.polkascan.io/kusama/api/v1', // no trailing slash
  theme: '@/assets/scss/themes/kusama-production.scss',
  identiconTheme: 'polkadot',
  logo: 'img/logo/kusama.svg',
  favicon: 'img/favicon/kusama.ico',
  baseURL: '/',
  showValSelectorInPage: true, // set to false when showing val selector in header
  googleAnalytics: 'G-1Z6YQTB6TK',
}

// kusama production

// export const config = {
//   name: 'kusama',
//   title: 'Validator resource center and ranking',
//   nodeWs: 'wss://kusama-rpc.polkadot.io',
//   denom: 'KSM',
//   addressPrefix: 2,
//   tokenDecimals: 12,
//   historySize: 28, // 1 week
//   erasPerDay: 4,
//   polkascanAPI: 'https://explorer-31.polkascan.io/kusama/api/v1', // no trailing slash
//   theme: '@/assets/scss/themes/kusama-production.scss',
//   identiconTheme: 'polkadot',
//   logo: 'img/logo/kusama.svg',
//   favicon: 'img/favicon/kusama.ico',
//   baseURL: '/',
//   showValSelectorInPage: true, // set to false when showing val selector in header
//   googleAnalytics: 'G-1Z6YQTB6TK',
// }

// polkadot

// export const config = {
//   name: 'polkadot',
//   title: 'Validator resource center and ranking',
//   nodeWs: 'wss://rpc.polkadot.io',
//   denom: 'DOT',
//   addressPrefix: 1,
//   tokenDecimals: 10,
//   historySize: 7, // 1 week
//   erasPerDay: 1,
//   polkascanAPI: 'https://explorer-31.polkascan.io/polkadot/api/v1', // no trailing slash
//   theme: '@/assets/scss/themes/polkadot.scss',
//   identiconTheme: 'polkadot',
//   logo: 'img/logo/polkadot.svg',
//   favicon: 'img/favicon/polkadot.ico',
//   baseURL: '/kusama-validator-resource-center/',
//   showValSelectorInPage: false,
// }

// edgeware

// export const config = {
//   name: 'edgeware',
//   title: 'Validator resource center and ranking',
//   nodeWs: 'wss://mainnet1.edgewa.re',
//   denom: 'EDG',
//   addressPrefix: 7,
//   tokenDecimals: 18,
//   historySize: 28, // 1 week
//   erasPerDay: 4,
//   polkascanAPI: '', // no trailing slash
//   theme: '@/assets/scss/themes/edgeware.scss',
//   identiconTheme: 'substrate',
//   logo: 'img/logo/edgeware.png',
//   favicon: 'img/favicon/edgeware.ico',
//   baseURL: '/kusama-validator-resource-center/',
//   showValSelectorInPage: false,
// }

// stafi

// export const config = {
//   name: 'stafi',
//   title: 'Validator resource center and ranking',
//   nodeWs: 'wss://mainnet-rpc.stafi.io',
//   denom: 'FIS',
//   addressPrefix: 20,
//   tokenDecimals: 12,
//   historySize: 28, // 1 week
//   erasPerDay: 4,
//   polkascanAPI: '', // no trailing slash
//   theme: '@/assets/scss/themes/stafi.scss',
//   identiconTheme: 'substrate',
//   logo: 'img/logo/stafi.png',
//   favicon: 'img/favicon/stafi.ico',
//   baseURL: '/kusama-validator-resource-center/',
//   showValSelectorInPage: false,
// }
