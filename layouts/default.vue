<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark" sticky>
      <b-container>
        <b-navbar-brand>
          <nuxt-link
            to="/"
            class="navbar-brand"
            title="Validator Resource Center and Ranking Website for Kusama"
          >
            <img class="logo mb-1" src="../assets/img/kusama-logo.svg" />
          </nuxt-link>
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse">
          <template>
            <svg
              class="icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 17C3 17.5523 3.44772 18 4 18H20C20.5523 18 21 17.5523 21 17V17C21 16.4477 20.5523 16 20 16H4C3.44772 16 3 16.4477 3 17V17ZM3 12C3 12.5523 3.44772 13 4 13H20C20.5523 13 21 12.5523 21 12V12C21 11.4477 20.5523 11 20 11H4C3.44772 11 3 11.4477 3 12V12ZM4 6C3.44772 6 3 6.44772 3 7V7C3 7.55228 3.44772 8 4 8H20C20.5523 8 21 7.55228 21 7V7C21 6.44772 20.5523 6 20 6H4Z"
                fill="#ffffff"
              ></path>
            </svg>
          </template>
        </b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item href="#">Validator Ranking</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>
    <Nuxt />
  </div>
</template>

<style lang="scss">
// Variable overrides
$body-bg: #000;
$body-color: #fff;
$primary: #e6007a;
$secondary: #6c757d;
$dark: #000;
$border-radius: 0 !default;
$border-radius-lg: 0 !default;
$border-radius-sm: 0 !default;

$pagination-color: $body-color !default;
$pagination-bg: $dark !default;
$pagination-border-color: $secondary !default;

$pagination-hover-color: $primary !default;
$pagination-hover-bg: $dark !default;
$pagination-hover-border-color: $secondary !default;

$pagination-active-color: $primary !default;
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

// Bootstrap and its default variables
@import '../node_modules/bootstrap/scss/bootstrap';
// BootstrapVue and its default variables
@import '../node_modules/bootstrap-vue/src/index.scss';

body {
  font-family: 'Space Mono', monospace;
}
.logo {
  height: 1.65rem;
}
.navbar-dark {
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
}
.navbar {
  padding: 0.9rem 1.5rem;
}
.navbar-dark .navbar-toggler {
  color: white;
  border: 0;
  outline: 0;
}
.identicon {
  display: inline-block;
}
.custom-switch .custom-control-label {
  cursor: pointer;
}
// Scan lines
.scanlines {
  overflow: hidden;
  mix-blend-mode: difference;
}
.scanlines::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0%,
    rgba(255, 255, 255, 0.05) 0.5%,
    transparent 0.9%
  );
}
</style>
