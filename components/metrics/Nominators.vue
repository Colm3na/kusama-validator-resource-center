<template>
  <div>
    <div class="row">
      <div class="col-8">
        <h4 class="mb-0">Nominators</h4>
      </div>
      <div class="col-4 text-right text-success">
        <Rating key="nominators" :rating="rating" />
      </div>
    </div>
    <hr />
    <p>Detected {{ nominators }} nominator/s</p>
  </div>
</template>
<script>
import Rating from '../../components/Rating.vue'
export default {
  components: {
    Rating,
  },
  props: {
    nominators: {
      type: Number,
      default: () => 0,
    },
  },
  computed: {
    rating() {
      // https://github.com/paritytech/polkadot/blob/master/runtime/kusama/src/lib.rs#L330
      return this.nominators > 0 && this.nominators < 128 ? 2 : 0
    },
  },
}
</script>
