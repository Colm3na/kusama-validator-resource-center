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

<style lang="scss">
@font-face {
  font-family: 'Visuelt';
  src: url('../assets/fonts/Visuelt/Visuelt.ttf') format('truetype');
}

html {
  position: relative;
  min-height: 100%;
}
body {
  font-family: 'Space Mono', monospace;
  margin-bottom: 60px;
  font-size: 0.9rem;
}
body::-webkit-scrollbar {
  width: 10px;
}
body::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
body::-webkit-scrollbar-thumb {
  background-color: var(--primary2);
  outline: none;
}
.logo {
  height: 1.65rem;
}
.navbar-dark {
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
}
.identicon {
  display: inline-block;
}
.custom-switch .custom-control-label {
  cursor: pointer;
}
.hr {
  color: gray;
}
.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px;
  line-height: 60px;
  font-size: 0.8rem;
}
.footer a {
  color: white;
}
.close:hover {
  color: #d1ecf1;
}
.toast-body {
  word-break: break-all;
}
pre {
  font-size: initial;
  color: var(--light);
}
.nav-tabs .nav-item a {
  color: var(--light);
}
.text-selected {
  color: #00effc;
}
.btn-selected {
  color: #e6007a !important;
  border-color: #e6007a;
}
.selected-validators .dropdown-menu {
  width: 400px;
  padding: 1rem;
  color: gray;
}
.selected-validators .dropdown-menu a span {
  color: gray;
}
@media (max-width: 576px) {
  .selected-validators .dropdown-menu {
    width: 350px;
  }
}
</style>
