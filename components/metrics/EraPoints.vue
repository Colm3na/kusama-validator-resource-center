<template>
  <div>
    <div class="row">
      <div class="col-8">
        <h4 class="mb-0">Era points</h4>
      </div>
      <div class="col-4 text-right text-success">
        <Rating key="erapoints" :rating="rating" />
      </div>
    </div>
    <hr />
    <p v-if="rating === 2">
      Above average! {{ percent.toFixed(2) }}% of era points in the last week<br />
    </p>
    <p v-else>
      Below average! {{ percent.toFixed(2) }}% of era points in the last week<br />
    </p>
  </div>
</template>
<script>
import Rating from '../../components/Rating.vue'
export default {
  components: {
    Rating,
  },
  props: {
    eraPointsHistory: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    eraPointsHistoryTotals() {
      return this.$store.state.ranking.eraPointsHistoryTotals.reduce(
        (total, num) => total + num,
        0
      )
    },
    eraPointsHistoryValidator() {
      return this.eraPointsHistory.reduce((total, num) => total + num, 0)
    },
    numActiveValidators() {
      return (
        this.$store.state.ranking.list.filter(({ active }) => active).length ||
        0
      )
    },
    average() {
      return this.eraPointsHistoryTotals / this.numActiveValidators
    },
    percent() {
      return (
        (this.eraPointsHistoryValidator * 100) / this.eraPointsHistoryTotals
      )
    },
    rating() {
      return this.eraPointsHistoryValidator > this.average ? 2 : 0
    },
  },
}
</script>
