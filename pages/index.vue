<template>
  <div class="page container pt-3">
    <div>
      <b-alert show dismissible variant="info" class="text-center py-3 glitch">
        <p>
          The {{ config.title }} for {{ capitalize(config.name) }} aims to
          provide quantitative and qualitative data about validators performance
          and help nominators to choose their best nomination set.
        </p>
        <p>
          In order to fetch on-chain data in a reasonable amount of time the
          size of the
          <strong
            >history is limited to
            {{ config.historySize / config.erasPerDay }} days</strong
          >
        </p>
      </b-alert>
      <b-alert
        show
        dismissible
        variant="warning"
        class="text-center py-3 glitch"
      >
        <p>
          This platform is currently under development and the metrics are
          subject to change. Please do your own research before nominating your
          validator set.
        </p>
      </b-alert>
      <Ranking />
    </div>
  </div>
</template>

<script>
import Ranking from '@/components/Ranking.vue'
import { config } from '@/config.js'
import commonMixin from '@/mixins/commonMixin.js'
export default {
  components: {
    Ranking,
  },
  mixins: [commonMixin],
  data() {
    return {
      config,
    }
  },
  head() {
    return {
      title: `${config.title} for ${this.capitalize(config.name)}`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `${config.title} for ${this.capitalize(config.name)}`,
        },
      ],
    }
  },
}
</script>
