<template>
  <div class="metric h-100">
    <div class="row mb-4">
      <div class="col-8">
        <h5 class="mb-0">
          Slashes
          <nuxt-link
            to="/metrics#slashes"
            v-b-tooltip.hover
            title="Evaluate if the validator have a unapplied slash"
          >
            <font-awesome-icon
              icon="question-circle"
              class="d-inline-block"
              style="font-size: 1rem"
            />
          </nuxt-link>
        </h5>
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
