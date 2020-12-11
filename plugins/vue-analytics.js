import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import { config } from '@/config.js'

const kusamaValidatorsNetwork = JSON.parse(
  decodeURIComponent(localStorage.getItem('kusamaValidatorsNetwork'))
)
Vue.use(VueAnalytics, {
  id: config.googleAnalytics,
  disabled: !kusamaValidatorsNetwork.googleAnalytics,
})
