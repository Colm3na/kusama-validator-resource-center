<template>
  <div>
    <HeaderKusama />
    <Nuxt />
    <Footer />
  </div>
</template>

<script>
// import { config } from '@/config.js'
// import SelectedValidators from '@/components/SelectedValidators.vue'
import HeaderKusama from '@/components/HeaderKusama.vue'
import Footer from '@/components/Footer.vue'
export default {
  components: {
    // SelectedValidators,
    HeaderKusama,
    Footer,
  },
  // data() {
  //   return {
  //     config,
  //   }
  // },
  // computed: {
  //   loading() {
  //     return this.$store.state.ranking.loading
  //   },
  //   selectedValidatorAddresses() {
  //     return this.$store.state.ranking.selectedAddresses
  //   },
  // },
  // watch: {
  //   $route(to, from) {
  //     this.$refs.selectedValidators.hide(true)
  //   },
  // },
  // created() {
  //   this.$store.dispatch('ranking/loadSelected')
  // },
}
</script>
