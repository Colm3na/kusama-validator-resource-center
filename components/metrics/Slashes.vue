<template>
  <div>
    <div class="row">
      <div class="col-8">
        <h4 class="mb-0">Slashes</h4>
      </div>
      <div class="col-4 text-right text-success">
        <Rating key="slashes" :rating="rating" />
      </div>
    </div>
    <hr />
    <p v-if="!slashed">Good! No slashes detected</p>
    <p v-else>Bad! Validator was slashed!</p>
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
