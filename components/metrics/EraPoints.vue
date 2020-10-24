<template>
  <div class="metric h-100">
    <div class="row mb-4">
      <div class="col-8">
        <h5 class="mb-0">Era points</h5>
      </div>
      <div class="col-4 text-right text-success">
        <Rating key="erapoints" :rating="rating" />
      </div>
    </div>
    <div class="description">
      <p v-if="rating === 2">
        Above average! {{ percent.toFixed(2) }}% of era points in the last
        week<br />
      </p>
      <p v-else>
        Below average! {{ percent.toFixed(2) }}% of era points in the last
        week<br />
      </p>
    </div>
  </div>
</template>
<script>
import Rating from '../../components/Rating.vue'
export default {
  components: {
    Rating,
  },
  props: {
    rating: {
      type: Number,
      default: () => 0,
    },
    percent: {
      type: Number,
      default: () => 0,
    },
  },
}
</script>
