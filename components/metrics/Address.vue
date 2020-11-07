<template>
  <div class="metric h-100">
    <div class="row mb-4">
      <div class="col-8">
        <h5 class="mb-0">
          Address creation
          <nuxt-link
            v-b-tooltip.hover
            to="/metrics#address"
            title="Evaluate how old is the validator address"
          >
            <font-awesome-icon
              icon="question-circle"
              class="d-inline-block"
              style="font-size: 1rem"
            />
          </nuxt-link>
        </h5>
      </div>
      <div class="col-4 text-right text-success">
        <Rating key="address" :rating="rating" />
      </div>
    </div>
    <div class="description">
      <p v-if="typeof createdAtBlock === 'number'">
        Address was created at block #{{ formatNumber(createdAtBlock) }}
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Rating from '../../components/Rating.vue'
import commonMixin from '../../mixins/commonMixin.js'
export default {
  components: {
    Rating,
  },
  mixins: [commonMixin],
  props: {
    accountId: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      createdAtBlock: undefined,
      rating: 0,
    }
  },
  computed: {
    blockHeight() {
      return this.$store.state.ranking.blockHeight
    },
  },
  created() {
    this.getAddressCreationDate()
  },
  methods: {
    getAddressCreationDate() {
      const vm = this
      axios
        .get(
          `https://explorer-31.polkascan.io/kusama/api/v1/account/${this.accountId}`
        )
        .then(function ({ data }) {
          vm.createdAtBlock = parseInt(data.data.attributes.created_at_block)
          if (vm.createdAtBlock <= vm.blockHeight / 4) {
            vm.rating = 3
          } else if (vm.createdAtBlock <= (vm.blockHeight / 4) * 2) {
            vm.rating = 2
          } else if (vm.createdAtBlock <= (vm.blockHeight / 4) * 3) {
            vm.rating = 1
          }
        })
    },
  },
}
</script>
