<template>
  <div class="metric h-100">
    <div class="row mb-4">
      <div class="col-8">
        <h5 class="mb-0">Slashes</h5>
      </div>
      <div class="col-4 text-right text-success">
        <Rating key="slashes" :rating="rating" />
      </div>
    </div>
    <div class="description">
      <p v-if="rating > 0">No unapplied slashes detected</p>
      <p v-else>Validator was slashed</p>
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
    slashes: {
      type: Array,
      default: () => [],
    },
    rating: {
      type: Number,
      default: () => 0,
    },
  },
}
</script>
