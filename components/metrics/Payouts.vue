<template>
  <div>
    <div class="row">
      <div class="col-8">
        <h4 class="mb-0">Frequency of payouts</h4>
      </div>
      <div class="col-4 text-right text-success">
        <Rating key="payouts" :rating="rating" />
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
