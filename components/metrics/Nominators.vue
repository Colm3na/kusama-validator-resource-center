<template>
  <div class="metric h-100">
    <div class="row mb-4">
      <div class="col-8">
        <h5 class="mb-0">Nominators</h5>
      </div>
      <div class="col-4 text-right text-success">
        <Rating key="nominators" :rating="rating" />
      </div>
    </div>
    <div class="description">
      <p v-if="rating > 0">
        Detected {{ nominators }} nominator<span v-if="nominators > 1">s</span>,
        validator is not oversubscripted
      </p>
      <p v-else>Validator doesn't have any nominators</p>
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
    nominators: {
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
