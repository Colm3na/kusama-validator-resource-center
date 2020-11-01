<template>
  <div class="selected-validators">
    <p v-if="loading" class="mb-0 text-center">Loading data...</p>
    <p v-else-if="list.length === 0" class="mb-0 text-center">
      No validators selected
    </p>
    <div v-else class="row mb-3">
      <div class="col-8">{{ list.length }}/16</div>
      <div class="col-4 text-right">
        <span
          v-b-tooltip.hover
          v-clipboard:copy="selectedAddressesText"
          title="Copy validator addresses to clipboard"
          @click.stop.prevent="showToast"
        >
          <font-awesome-icon
            icon="paperclip"
            style="color: gray; font-size: 1.5rem; cursor: pointer"
          />
        </span>
      </div>
    </div>
    <div v-for="validator in list" :key="validator.stashAddress" class="row">
      <div class="col-10 selected-validator">
        <Identicon :address="validator.stashAddress" :size="20" />
        <nuxt-link :to="`/validator/${validator.stashAddress}`">
          <span v-if="validator.name">
            {{ validator.name }}
            <VerifiedIcon />
          </span>
          <span v-else>
            {{ shortAddress(validator.stashAddress) }}
          </span>
        </nuxt-link>
      </div>
      <div class="col-2 text-right">
        <a
          v-b-tooltip.hover
          href="#"
          title="Remove"
          class="remove"
          @click.stop.prevent="remove(validator.stashAddress)"
        >
          <font-awesome-icon icon="times" />
        </a>
      </div>
    </div>
    <p v-if="list.length > 0" class="mt-3 mb-0">
      <b-button variant="kusama" class="btn-block" to="/nominate"
        >Nominate</b-button
      >
    </p>
  </div>
</template>

<script>
import Identicon from '../components/Identicon.vue'
import VerifiedIcon from '../components/VerifiedIcon.vue'
import commonMixin from '../mixins/commonMixin.js'
export default {
  components: {
    Identicon,
    VerifiedIcon,
  },
  mixins: [commonMixin],
  computed: {
    loading() {
      return this.$store.state.ranking.loading
    },
    list() {
      return this.$store.state.ranking.list.filter(({ stashAddress }) =>
        this.selectedAddresses.includes(stashAddress)
      )
    },
    selectedAddresses() {
      return this.$store.state.ranking.selectedAddresses
    },
    selectedAddressesText() {
      return this.selectedAddresses.join('\r\n')
    },
  },
  methods: {
    showToast() {
      this.$bvToast.toast(this.selectedAddressesText, {
        title: 'Addresses copied to clipboard!',
        variant: 'secondary',
        autoHideDelay: 5000,
        appendToast: false,
      })
    },
    remove(accountId) {
      this.$store.dispatch('ranking/toggleSelected', { accountId })
    },
  },
}
</script>
<style>
.addresses {
  cursor: pointer;
}
.remove,
.remove:hover,
.remove:active {
  color: rgba(255, 0, 0, 0.5);
}
.selected-validators .selected-validator {
  font-size: 0.8rem;
}
</style>
