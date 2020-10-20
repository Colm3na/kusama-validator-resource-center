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
    rating: {
      type: Number,
      default: () => 0,
    },
  },
}
</script>
