<template>
  <div class="rating">
    <span v-if="rating === 3" class="text-success">
      <font-awesome-icon icon="check" />
      Very good
    </span>
    <span v-else-if="rating === 2" class="text-success">
      <font-awesome-icon icon="check" />
      Good
    </span>
    <span v-else-if="rating === 1" class="text-warning">
      <font-awesome-icon icon="check" />
      Neutral
    </span>
    <span v-else class="text-danger">
      <font-awesome-icon icon="minus-circle" />
      Bad
    </span>
  </div>
</template>
<script>
export default {
  props: {
    rating: {
      type: Number,
      default: () => 0,
    },
  },
}
</script>
<style scoped>
.rating .svg-inline--fa {
  font-size: 0.7rem;
}
</style>
