<template>
  <div class="metric h-100">
    <div class="row mb-4">
      <div class="col-8">
        <h5 class="mb-0">Governance</h5>
      </div>
      <div class="col-4 text-right text-success">
        <Rating key="governance" :rating="rating" />
      </div>
    </div>
    <div class="description">
      <p v-if="councilBacking">
        The validator is backing at least one council member
      </p>
      <p v-else>The validator is not backing any council member</p>
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
    councilBacking: {
      type: Boolean,
      default: () => false,
    },
    rating: {
      type: Number,
      default: () => 0,
    },
  },
}
</script>
