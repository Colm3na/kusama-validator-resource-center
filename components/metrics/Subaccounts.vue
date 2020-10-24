<template>
  <div class="metric h-100">
    <div class="row mb-4">
      <div class="col-8">
        <h5 class="mb-0">Subaccounts</h5>
      </div>
      <div class="col-4 text-right text-success">
        <Rating key="subaccounts" :rating="rating" />
      </div>
    </div>
    <div class="description">
      <p v-if="rating > 0">Good! Detected sub-identity</p>
      <p v-else>Bad! No sub-identity detected</p>
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
  },
}
</script>
