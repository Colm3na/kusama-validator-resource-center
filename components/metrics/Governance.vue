<template>
  <div>
    <div class="row">
      <div class="col-8">
        <h4 class="mb-0">Governance</h4>
      </div>
      <div class="col-4 text-right text-success">
        <Rating key="governance" :rating="rating" />
      </div>
    </div>
    <hr />
    <p v-if="councilBacking">
      The validator is backing at least one council member
    </p>
    <p v-else>The validator is not backing any council member</p>
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
