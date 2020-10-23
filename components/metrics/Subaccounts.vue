<template>
  <div>
    <div class="row">
      <div class="col-8">
        <h4 class="mb-0">Subaccounts</h4>
      </div>
      <div class="col-4 text-right text-success">
        <Rating key="subaccounts" :rating="rating" />
      </div>
    </div>
    <hr />
    <p v-if="rating > 0">Good! Detected sub-identity</p>
    <p v-else>Bad! No sub-identity detected</p>
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
