<template>
  <div class="container">
    <div>
      <Logo />
      <h1 class="title mt-3">
        Validator Resource Center and Ranking Website for Kusama
      </h1>
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
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Space Mono', monospace;
  display: block;
  font-weight: 400;
  font-size: 60px;
  color: #e6007a;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
