<template>
  <span v-b-tooltip.hover title="Verified identity">
    <font-awesome-layers class="fa-lg verified">
      <font-awesome-icon icon="circle" class="circle" />
      <font-awesome-icon icon="check" transform="shrink-6" />
    </font-awesome-layers>
  </span>
</template>
<script>
export default {}
</script>
<style>
.verified .circle {
  color: #0fccd6;
}
.verified .fa-check {
  color: white;
}
</style>
