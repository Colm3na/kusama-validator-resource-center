<template>
  <div>
    <b-alert show dismissible variant="info" class="text-center py-3 glitch">
      You can select up to 16 validators
    </b-alert>
    <div class="row">
      <div class="col-md-6 mb-3">
        <h5>Selected validators:</h5>
        <hr />
        <div
          v-for="validator in list"
          :key="validator.stashAddress"
          class="d-block p-2"
        >
          <div class="row">
            <div class="col-10">
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
            <div class="col-2 text-right">
              <a
                v-b-tooltip.hover
                href="#"
                title="Remove"
                class="remove"
                @click="$emit('remove', validator.stashAddress)"
              >
                <font-awesome-icon icon="times" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6 mb-3">
        <h5>Addresses:</h5>
        <hr />
        <pre
          v-clipboard:copy="addresses"
          v-b-tooltip.hover
          class="addresses"
          title="Click to copy to clipboard"
          @click="showToast"
          >{{ addresses }}</pre
        >
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
  computed: {
    addresses() {
      return this.list.map(({ stashAddress }) => stashAddress).join('\r\n')
    },
  },
  methods: {
    showToast() {
      this.$bvToast.toast(this.addresses, {
        title: 'Addresses copied to clipboard!',
        variant: 'secondary',
        autoHideDelay: 5000,
        appendToast: false,
      })
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
  color: gray;
}
</style>
