<template>
  <div>
    <div class="row">
      <div class="col-8">
        <h4 class="mb-0">Era points</h4>
      </div>
      <div class="col-4 text-right text-success">
        <Rating key="slashes" :rating="rating" />
      </div>
    </div>
    <hr />
  </div>
</template>
<script>
import Rating from '../../components/Rating.vue'
export default {
  components: {
    Rating,
  },
}
</script>
