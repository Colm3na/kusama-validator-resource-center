<template>
  <b-table
    dark
    hover
    responsive
    stacked="md"
    thead-tr-class="d-none"
    :items="list"
    class="pt-3"
  ></b-table>
</template>

<script>
export default {
  props: {
    list: Array,
  },
}
</script>
