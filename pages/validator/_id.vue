<template>
  <div class="container pt-3">
    <div>
      <h1 class="text-center my-3">
        <Identicon
          :key="accountId"
          :size="64"
          :theme="'polkadot'"
          :value="accountId"
          class="identicon"
        />
        Validator {{ shortAddress(accountId) }}
      </h1>
      <pre class="text-white">{{ JSON.stringify(validator, null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
import Identicon from '@polkadot/vue-identicon'
import commonMixin from '../../mixins/commonMixin.js'

export default {
  components: {
    Identicon,
  },
  mixins: [commonMixin],
  data() {
    return {
      accountId: this.$route.params.id,
    }
  },
  computed: {
    loading() {
      return this.$store.state.ranking.loading
    },
    validator() {
      const validator = this.$store.state.ranking.list.find(
        (validator) => validator.stashAddress === this.accountId
      )
      return {
        ...validator,
        selected: this.isSelected(validator.stashAddress),
      }
    },
  },
  methods: {
    isSelected(accountId) {
      // return this.selectedValidatorAddresses.includes(accountId)
      return true
    },
  },
}
</script>

<style></style>
