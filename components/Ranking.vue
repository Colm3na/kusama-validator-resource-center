<template>
  <div>
    <div v-if="loading">
      <p class="my-3">
        This is a decentralized app and data collection may take some time,
        please be patient!
      </p>
      <p class="text-center">Loading...</p>
    </div>
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
        variant="dark"
      ></b-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      perPage: 10,
      currentPage: 1,
    }
  },
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
  async created() {
    if (this.$store.state.ranking.list.length === 0) {
      await this.$store.dispatch('ranking/update')
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
}
</script>
<style>
.validator pre {
  color: #fff;
}
</style>
