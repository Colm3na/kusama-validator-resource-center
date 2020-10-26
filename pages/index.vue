<template>
  <div class="container pt-3">
    <div>
      <b-alert show dismissible variant="info" class="text-center py-3 glitch">
        The Validator Resource Center and Ranking Website for Kusama aims to
        provide quantitative and qualitative data about validators performance
        and help nominators to choose their best nomination set
      </b-alert>
      <Ranking />
    </div>
  </div>
</template>

<script>
import Ranking from '../components/Ranking.vue'
export default {
  components: {
    Ranking,
  },
  head() {
    return {
      title: 'Validator Resource Center and Ranking Website for Kusama',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Validator Resource Center and Ranking Website for Kusama',
        },
      ],
    }
  },
}
</script>

<style>
.title {
  font-family: 'Space Mono', monospace;
  display: block;
  font-weight: 400;
  font-size: 25px;
  color: #e6007a;
  letter-spacing: 1px;
}
</style>
