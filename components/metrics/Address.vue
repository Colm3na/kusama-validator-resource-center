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
      <p v-if="loading">Fetching address creation block from PolkaScan...</p>
      <p v-else-if="typeof createdAtBlock === 'number'">
        Stash address was created at block #{{ formatNumber(createdAtBlock) }}
        <span v-if="typeof parentCreatedAtBlock === 'number'">
          and parent identity address was created at block #{{
            formatNumber(parentCreatedAtBlock)
          }}
        </span>
      </p>
      <p v-else>Address creation metric is not available for this network</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Rating from '@/components/Rating.vue'
import commonMixin from '@/mixins/commonMixin.js'
import { config } from '@/config.js'
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
    identity: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      createdAtBlock: undefined,
      parentCreatedAtBlock: undefined,
      rating: -1,
      loading: true,
    }
  },
  computed: {
    blockHeight() {
      return this.$store.state.ranking.blockHeight
    },
  },
  created() {
    this.getAddressCreationMetricData()
  },
  methods: {
    getAddressCreationMetricData() {
      const vm = this
      if (this.identity.parent) {
        axios
          .all([
            axios.get(`${config.polkascanAPI}/account/${vm.identity.parent}`),
            axios.get(`${config.polkascanAPI}/account/${vm.accountId}`),
          ])
          .then(
            axios.spread((...responses) => {
              vm.parentCreatedAtBlock = parseInt(
                responses[0].data.data.attributes.created_at_block
              )
              vm.createdAtBlock = parseInt(
                responses[1].data.data.attributes.created_at_block
              )
              const best =
                vm.parentCreatedAtBlock > vm.createdAtBlock
                  ? vm.createdAtBlock
                  : vm.parentCreatedAtBlock
              if (best <= vm.blockHeight / 4) {
                vm.rating = 3
              } else if (best <= (vm.blockHeight / 4) * 2) {
                vm.rating = 2
              } else if (best <= (vm.blockHeight / 4) * 3) {
                vm.rating = 1
              } else {
                vm.rating = 0
              }
              vm.loading = false
            })
          )
      } else {
        axios
          .get(`${config.polkascanAPI}/account/${vm.accountId}`)
          .then(function ({ data }) {
            vm.createdAtBlock = parseInt(data.data.attributes.created_at_block)
            if (vm.createdAtBlock <= vm.blockHeight / 4) {
              vm.rating = 3
            } else if (vm.createdAtBlock <= (vm.blockHeight / 4) * 2) {
              vm.rating = 2
            } else if (vm.createdAtBlock <= (vm.blockHeight / 4) * 3) {
              vm.rating = 1
            }
            vm.loading = false
          })
      }
    },
  },
}
</script>
