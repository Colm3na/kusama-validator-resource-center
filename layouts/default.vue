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
        <!-- <b-navbar-nav class="mr-auto">
          <b-nav-item to="/metrics">Metrics</b-nav-item>
        </b-navbar-nav> -->
        <b-navbar-nav>
          <b-nav-item-dropdown
            id="selected-validators"
            class="selected-validators"
            toggle-class="btn btn-selected"
            right
          >
            <template #button-content>
              Selected validators <font-awesome-icon icon="hand-paper" /> ({{
                selectedValidatorAddresses.length
              }})
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
    selectedValidatorAddresses() {
      return this.$store.state.ranking.selectedAddresses
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

// Base grayscale colors definitions
$white: #fff !default;
$gray-100: #f8f9fa !default;
$gray-200: #e9ecef !default;
$gray-300: #dee2e6 !default;
$gray-400: #ced4da !default;
$gray-500: #adb5bd !default;
$gray-600: #6c757d !default;
$gray-700: #495057 !default;
$gray-800: #343a40 !default;
$gray-900: #212529 !default;
$black: #000 !default;

// Base colors definitions
$blue: #007bff !default;
$indigo: #6610f2 !default;
$purple: #6f42c1 !default;
$pink: #e83e8c !default;
$red: #dc3545 !default;
$orange: #fd7e14 !default;
$yellow: #ffc107 !default;
$green: #28a745 !default;
$teal: #20c997 !default;
$cyan: #17a2b8 !default;

$body-bg: #000;
$body-color: #fff;
$primary: #fff;
$secondary: #aaafb3;
$success: #0dff7e;
$kusama: #e6007a;
$info: $cyan !default;
$warning: $yellow !default;
$danger: $red !default;
$light: $gray-500 !default;
$dark: #000;

// This table defines the theme colors (variant names)
$theme-colors: () !default;
$theme-colors: map-merge(
  (
    'primary': $primary,
    'secondary': $secondary,
    'success': $success,
    'info': $info,
    'warning': $warning,
    'danger': $danger,
    'light': $light,
    'dark': $dark,
    'kusama': $kusama,
  ),
  $theme-colors
);

$border-radius: 0 !default;
$border-radius-lg: 0 !default;
$border-radius-sm: 0 !default;

$pagination-color: $body-color !default;
$pagination-bg: $dark !default;
$pagination-border-color: $secondary !default;

$pagination-hover-color: $primary !default;
$pagination-hover-bg: $dark !default;
$pagination-hover-border-color: $secondary !default;

$pagination-active-color: $secondary !default;
$pagination-active-bg: $dark !default;
$pagination-active-border-color: $secondary !default;

$pagination-disabled-color: $secondary !default;
$pagination-disabled-bg: $dark !default;
$pagination-disabled-border-color: $secondary !default;

$table-dark-bg: $body-bg !default;
$table-dark-border-color: rgba(255, 255, 255, 0.2) !default;

$alert-bg-level: 10;
$alert-border-level: 1;
$alert-color-level: -10;

$nav-tabs-link-active-color: $body-color !default;

$hr-border-color: rgba(255, 255, 255, 0.2) !default;

$custom-control-indicator-checked-bg: #e6007a !default;
$custom-control-indicator-bg: white !default;

$navbar-dark-color: $light !default;
$navbar-dark-hover-color: $white !default;
$navbar-dark-disabled-color: $white !default;

$h1-font-size: 2.1rem !default;

// Bootstrap and its default variables
@import '../node_modules/bootstrap/scss/bootstrap';
// BootstrapVue and its default variables
@import '../node_modules/bootstrap-vue/src/index.scss';

html {
  position: relative;
  min-height: 100%;
}
body {
  font-family: 'Space Mono', monospace;
  margin-bottom: 60px;
  font-size: 0.9rem;
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
</style>
