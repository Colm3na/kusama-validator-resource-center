<template>
  <div class="metric h-100">
    <div class="row mb-4">
      <div class="col-8">
        <h5 class="mb-0">Commission</h5>
      </div>
      <div class="col-4 text-right text-success">
        <Rating key="commission" :rating="rating" />
      </div>
    </div>
    <div class="description">
      <p v-if="commission">Commission is {{ commission.toFixed(1) }}%</p>
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
    commission: {
      type: Number,
      default: () => 0,
    },
    rating: {
      type: Number,
      default: () => 0,
    },
  },
}
</script>
