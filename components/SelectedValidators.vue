<template>
  <div>
    <p>You can select up to 6 validators</p>
    <div class="row">
      <div class="col-md-6">
        <h5>Selected validators:</h5>
        <hr />
        <div
          v-for="validator in list"
          :key="validator.stashAddress"
          class="d-block p-3"
        >
          <Identicon :address="validator.stashAddress" :size="28" />
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
      <div class="col-md-6">
        <h5>Validator addresses:</h5>
        <hr />
        <pre>{{
          list.map(({ stashAddress }) => stashAddress).join('\r\n')
        }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import Identicon from '../components/Identicon.vue'
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
