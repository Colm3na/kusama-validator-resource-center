<template>
  <div class="container pt-3">
    <div>
      <b-alert show dismissible variant="info" class="text-center py-3 glitch">
        The {{ config.title }} for {{ config.name }} aims to provide
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
export default {
  components: {
    Ranking,
  },
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
          content: `${config.title} for ${config.name}`,
        },
      ],
    }
  },
}
</script>
