<template>
  <div>
    <b-navbar type="dark" variant="dark" sticky>
      <b-container class="px-sm-3">
        <b-navbar-brand>
          <nuxt-link
            to="/"
            class="navbar-brand"
            title="Validator Resource Center and Ranking Website for Kusama"
          >
            <img class="logo mb-1" src="../assets/img/kusama-logo.svg" />
          </nuxt-link>
        </b-navbar-brand>
        <b-navbar-nav>
          <b-nav-item-dropdown
            id="selected-validators"
            ref="selectedValidators"
            class="selected-validators"
            toggle-class="btn btn-selected"
            right
          >
            <template #button-content>
              <span v-if="loading">Selected</span>
              <span v-else>
                {{ selectedValidatorAddresses.length }}/16 selected
              </span>
              <font-awesome-icon icon="hand-paper" />
            </template>
            <SelectedValidators />
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-container>
    </b-navbar>
    <Nuxt />
    <footer class="footer">
      <div class="container text-center">
        &copy; {{ new Date().getFullYear() }}
        Kusama ·
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
  </div>
</template>

<script>
import SelectedValidators from '../components/SelectedValidators.vue'
export default {
  components: {
    SelectedValidators,
  },
  computed: {
    loading() {
      return this.$store.state.ranking.loading
    },
    selectedValidatorAddresses() {
      return this.$store.state.ranking.selectedAddresses
    },
  },
  watch: {
    $route(to, from) {
      this.$refs.selectedValidators.hide(true)
    },
  },
  created() {
    this.$store.dispatch('ranking/loadSelected')
  },
}
</script>
