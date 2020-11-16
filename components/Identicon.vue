<template>
  <div
    v-b-tooltip.hover
    title="Click to copy validator address to clipboard"
    class="d-inline"
    @click="showToast"
  >
    <Identicon
      :key="address"
      v-clipboard:copy="address"
      :size="size"
      :theme="'polkadot'"
      :value="address"
      class="identicon"
    />
  </div>
</template>
<script>
import Identicon from '@polkadot/vue-identicon'

export default {
  components: {
    Identicon,
  },
  props: {
    address: {
      type: String,
      default: () => '',
    },
    size: {
      type: Number,
      default: () => 20,
    },
  },
  methods: {
    showToast() {
      this.$bvToast.toast(this.address, {
        title: 'Address copied to clipboard!',
        variant: 'secondary',
        autoHideDelay: 5000,
        appendToast: false,
      })
    },
  },
}
</script>
