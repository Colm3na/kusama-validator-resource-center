<template>
  <div class="container pt-3">
    <div>
      <p class="text-center py-3">
        The Validator Resource Center and Ranking Website for Kusama aims to
        provide quantitative and qualitative data about validators performance
        and help nominators to choose their best nomination set
      </p>
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
  head: {
    title: 'Validator Resource Center and Ranking Website for Kusama',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Validator Resource Center and Ranking Website for Kusama',
      },
    ],
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
