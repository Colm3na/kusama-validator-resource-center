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
    slashed: {
      type: Boolean,
      default: () => false,
    },
    slashes: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    rating() {
      return this.slashed ? 0 : 2
    },
  },
}
</script>
