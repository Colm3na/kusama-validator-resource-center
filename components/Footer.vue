<template>
  <footer class="footer">
    <div class="container text-center">
      &copy; {{ new Date().getFullYear() }} {{ capitalize(config.name) }} ·
      <a href="https://kusama.network/privacy" target="_blank"
        >Privacy Policy</a
      >
      ·
      <a href="https://kusama.network/terms" target="_blank"
        >Terms and Conditions</a
      >
      ·
      <a href="#" target="_blank">Cookie Settings</a>
    </div>
  </footer>
</template>
<script>
import { config } from '@/config.js'
import commonMixin from '@/mixins/commonMixin.js'
export default {
  mixins: [commonMixin],
  data() {
    return {
      config,
    }
  },
}
</script>
