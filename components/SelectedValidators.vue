<template>
  <div>
    <p>You can select up to 6 validators</p>
    <div
      v-for="validator in list"
      :key="validator.stashAddress"
      class="d-block p-3"
    >
      <Identicon
        :key="validator.stashAddress"
        :size="28"
        :theme="'polkadot'"
        :value="validator.stashAddress"
        class="identicon"
      />
      <span v-if="validator.name">
        {{ validator.name }}
        <span v-b-tooltip.hover title="Verified identity">
          <font-awesome-icon
            v-if="validator.verifiedIdentity"
            icon="check"
            class="text-success verified"
          />
        </span>
      </span>
      <span v-else>
        {{ shortAddress(validator.stashAddress) }}
      </span>
    </div>
  </div>
</template>

<script>
import Identicon from '@polkadot/vue-identicon'
import commonMixin from '../mixins/commonMixin.js'
export default {
  components: {
    Identicon,
  },
  mixins: [commonMixin],
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
