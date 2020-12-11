<template>
  <footer class="footer">
    <div class="container text-center text-muted">
      &copy; {{ new Date().getFullYear() }} {{ capitalize(config.name) }} ·
      <a href="https://kusama.network/privacy" target="_blank"
        >Privacy Policy</a
      >
      ·
      <a href="https://kusama.network/terms" target="_blank"
        >Terms and Conditions</a
      >
      ·
      <a href="#" @click.prevent="Klaro.show()">Cookie Settings</a>
    </div>
  </footer>
</template>
<script>
import { config } from '@/config.js'
import commonMixin from '@/mixins/commonMixin.js'
import * as Klaro from 'klaro'
import { klaroConfig } from '@/klaro.config.js'
Klaro.setup(klaroConfig)
export default {
  mixins: [commonMixin],
  data() {
    return {
      config,
      Klaro,
    }
  },
  created() {
    const vm = this
    setInterval(function () {
      const kusamaValidatorsNetwork = JSON.parse(
        decodeURIComponent(localStorage.getItem('kusamaValidatorsNetwork'))
      )
      if (kusamaValidatorsNetwork) {
        if (kusamaValidatorsNetwork.googleAnalytics) {
          vm.$ga.enable()
        } else {
          vm.$ga.disable()
        }
      } else {
        vm.$ga.disable()
      }
    }, 10000)
  },
}
</script>
