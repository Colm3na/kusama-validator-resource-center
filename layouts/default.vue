<template>
  <div>
    <Header />
    <Nuxt />
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/HeaderKusama.vue'
import Footer from '@/components/Footer.vue'
export default {
  components: {
    Header,
    Footer,
  },
}
</script>
