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
