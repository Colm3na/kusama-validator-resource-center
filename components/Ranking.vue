<template>
  <div>
    <div v-if="loading">Loading ...</div>
    <div v-else>
      <b-table
        dark
        striped
        hover
        :items="ranking"
        :per-page="perPage"
        :current-page="currentPage"
      ></b-table>
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="my-table"
      ></b-pagination>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    loading() {
      return this.$store.state.ranking.loading
    },
    ranking() {
      return this.$store.state.ranking.list.map((validator, index) => {
        return {
          rank: index + 1,
          name: this.getName(validator.identity),
          accountId: validator.accountId,
          nominators: validator.exposure.others.length,
        }
      })
    },
    rows() {
      return this.ranking.length
    },
  },
  data() {
    return {
      perPage: 10,
      currentPage: 1,
    }
  },
  methods: {
    getName(identity) {
      if (
        identity.displayParent &&
        identity.displayParent !== `` &&
        identity.display &&
        identity.display !== ``
      ) {
        return `${identity.displayParent} / ${identity.display}`
      } else {
        return identity.display || ``
      }
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
