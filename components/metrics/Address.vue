<template>
  <div>
    <div class="row">
      <div class="col-9">
        <h4 class="mb-0">Address creation</h4>
      </div>
      <div class="col-3 text-right text-success">
        <Rating key="address" :rating="rating" />
      </div>
    </div>
    <hr />
    <p v-if="typeof createdAtBlock === 'number'">
      Address was created at block #{{ formatNumber(createdAtBlock) }}
    </p>
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
          if (vm.createdAtBlock < vm.blockHeight / 4) {
            vm.rating = 3
          } else if (vm.createdAtBlock < (vm.blockHeight / 4) * 2) {
            vm.rating = 2
          } else if (vm.createdAtBlock < (vm.blockHeight / 4) * 3) {
            vm.rating = 1
          }
        })
    },
  },
}
</script>
