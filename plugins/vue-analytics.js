import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import { config } from '@/config.js'

export default ({ app }) => {
  const kusamaValidatorsNetwork = JSON.parse(
    decodeURIComponent(localStorage.getItem('kusamaValidatorsNetwork'))
  )
  Vue.use(VueAnalytics, {
    id: config.googleAnalytics,
    router: app.router,
    disabled: kusamaValidatorsNetwork
      ? !kusamaValidatorsNetwork.googleAnalytics
      : true,
    // debug: {
    //   enabled: true,
    // },
    fields: {
      cookieDomain: 'validators.kusama.network',
    },
  })
}
