<template>
  <div>
    <div class="row">
      <div class="col-8">
        <h4 class="mb-0">Frequency of payouts</h4>
      </div>
      <div class="col-4 text-right text-success">
        <Rating key="payouts" :rating="rating" />
      </div>
    </div>
    <hr />
    <p v-if="rating === 3">Payout detected in the last 24 hours</p>
    <p v-else-if="rating === 2">Last payout happened between 1-3 days before</p>
    <p v-else-if="rating === 1">Last payout happened between 3-7 days before</p>
    <p v-else>No payouts detected in the last week</p>
  </div>
</template>
<script>
import Rating from '../../components/Rating.vue'
export default {
  components: {
    Rating,
  },
  props: {
    payoutHistory: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    rating() {
      const pendingEras = this.payoutHistory.filter((era) => !era).length
      if (pendingEras <= 4) {
        return 3
      } else if (pendingEras <= 12) {
        return 2
      } else if (pendingEras < 28) {
        return 1
      }
      return 0
    },
  },
}
</script>
