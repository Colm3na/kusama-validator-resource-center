<template>
  <div>
    <p class="loading text-center">
      This is a decentralized app and data collection may take around 1 minute
      so please be patient
    </p>
    <text-typing
      :texts="['Fetching chain data...']"
      :speed="100"
      :delay="3000"
      fixed-text-class="text-white"
      dynamic-text-class="text-teal-200"
      caret-class="text-white"
      class="pt-3 text-center"
    >
    </text-typing>
  </div>
</template>
<script>
export default {}
</script>

<style>
.loading {
  margin-top: calc(30vh);
}
</style>
