export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  router: {
    base: '/kusama-validator-resource-center/',
  },

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'kusama-validator-resource-center',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: ['@/plugins/vue-typed-text.js'],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://www.npmjs.com/package/@nuxtjs/google-fonts
    [
      '@nuxtjs/google-fonts',
      {
        families: {
          'Space+Mono': [400, 700],
        },
      },
    ],
    // https://github.com/nuxt-community/fontawesome-module
    '@nuxtjs/fontawesome',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://www.npmjs.com/package/cookie-universal-nuxt
    ['cookie-universal-nuxt', { alias: 'cookies' }],
  ],
  fontawesome: {
    icons: {
      solid: true,
      regular: true,
    },
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},
}
