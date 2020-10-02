<template>
  <div>
    <div
      v-for="validator in ranking"
      :key="validator.accountId"
      class="validator"
    >
      <pre>{{ JSON.stringify(validator, null, 2) }}</pre>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    ranking() {
      return this.$store.state.ranking.list
    },
  },
  async created() {
    if (this.$store.state.ranking.list.length === 0) {
      await this.$store.dispatch('ranking/update')
    }
  },
}
</script>
<style>
.validator pre {
  color: #fff;
}
</style>
