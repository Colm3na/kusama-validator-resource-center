<template>
  <div
    @click="showToast"
    v-b-tooltip.hover
    title="Click to copy validator address to clipboard"
    class="d-inline"
  >
    <Identicon
      :key="address"
      :size="size"
      :theme="'polkadot'"
      :value="address"
      class="identicon"
      v-clipboard:copy="address"
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
      console.log(this.address)
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
<style>
.identicon {
  cursor: pointer;
}
</style>
