<template>
  <div>
    <div class="row">
      <div class="col-8">
        <h4 class="mb-0">Commission</h4>
      </div>
      <div class="col-4 text-right text-success">
        <Rating key="commission" :rating="rating" />
      </div>
    </div>
    <hr />
    <p v-if="commission">Commission is {{ commission.toFixed(1) }}%</p>
  </div>
</template>
<script>
import Rating from '../../components/Rating.vue'
export default {
  components: {
    Rating,
  },
  props: {
    commission: {
      type: Number,
      default: () => 0,
    },
    commissionHistory: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    decreaseOverTime() {
      if (
        this.commissionHistory[0] >
        this.commissionHistory[this.commissionHistory.length - 1]
      ) {
        return true
      }
      return false
    },
    eraHistory() {
      return this.$store.state.ranking.eraHistory
    },
    rating() {
      if (this.commission === 100) {
        return 0
      } else if (this.commission > 10) {
        return 1
      } else if (this.commission >= 5) {
        if (this.decreaseOverTime) {
          return 3
        }
        return 2
      } else if (this.commission < 5) {
        return 3
      }
      return 0
    },
  },
}
</script>
