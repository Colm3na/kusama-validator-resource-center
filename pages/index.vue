<template>
  <div class="container pt-3">
    <div>
      <b-alert show dismissible variant="info" class="text-center py-3 glitch">
        The {{ config.title }} for {{ capitalize(config.name) }} aims to provide
        quantitative and qualitative data about validators performance and help
        nominators to choose their best nomination set
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
      title: `${config.title} for ${config.name}`,
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
