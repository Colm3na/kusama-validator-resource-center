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
        :fields="fields"
        :items="ranking"
        :per-page="perPage"
        :current-page="currentPage"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
      ></b-table>
      <div class="row">
        <div class="col-4">
          <b-button-group>
            <b-button variant="outline-secondary" @click="setPageSize(10)"
              >10</b-button
            >
            <b-button variant="outline-secondary" @click="setPageSize(20)"
              >20</b-button
            >
            <b-button variant="outline-secondary" @click="setPageSize(50)"
              >50</b-button
            >
            <b-button variant="outline-secondary" @click="setPageSize(100)"
              >100</b-button
            >
            <b-button variant="outline-secondary" @click="setPageSize(1000)"
              >All</b-button
            >
          </b-button-group>
        </div>
        <div class="col-8">
          <b-pagination
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            aria-controls="my-table"
            variant="dark"
            align="right"
          ></b-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      perPage: 10,
      currentPage: 1,
      sortBy: 'rank',
      sortDesc: false,
      fields: [
        { key: 'rank', sortable: true },
        { key: 'name', sortable: true },
        { key: 'accountId', sortable: true },
        { key: 'nominators', sortable: true },
      ],
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
    setPageSize(size) {
      this.perPage = size
    },
  },
}
</script>
<style>
.validator pre {
  color: #fff;
}
</style>
