<template>
  <div class="metric h-100">
    <div class="row mb-4">
      <div class="col-8">
        <h5 class="mb-0">
          Frequency of payouts
          <nuxt-link
            v-b-tooltip.hover
            to="/metrics#payouts"
            title="Evaluate frequency of rewards distribution"
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
        <Rating key="payouts" :rating="rating" />
      </div>
    </div>
    <div class="description">
      <p v-if="rating === 3">
        Very good, validator has {{ pending }} unclaimed era rewards
      </p>
      <p v-else-if="rating === 2">
        Good, validator has {{ pending }} unclaimed era rewards
      </p>
      <p v-else-if="rating === 1">
        Neutral, validator has {{ pending }} unclaimed era rewards
      </p>
      <p v-else>No payouts detected in the last week</p>
    </div>
  </div>
</template>
<script>
import Rating from '@/components/Rating.vue'
import { config } from '@/config.js'
export default {
  components: {
    Rating,
  },
  data() {
    return {
      config,
    }
  },
  computed: {
    pending() {
      return this.payoutHistory.filter((era) => era === 'pending').length
    }
  },
  props: {
    payoutHistory: {
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
