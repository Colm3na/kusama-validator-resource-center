<template>
  <b-navbar type="dark" variant="dark" sticky>
    <b-container class="px-sm-3">
      <b-navbar-brand>
        <nuxt-link to="/" class="navbar-brand" :title="config.title">
          <img class="logo mb-1" :src="config.logo" />
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
</template>

<script>
import { config } from '@/config.js'
import SelectedValidators from '@/components/SelectedValidators.vue'
export default {
  components: {
    SelectedValidators,
  },
  data() {
    return {
      config,
    }
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
