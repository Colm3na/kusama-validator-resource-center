<template>
  <div>
    <div v-if="loading">
      <p class="text-center my-3">
        This is a decentralized app and data collection may take some time,
        please be patient!
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
    <div v-else>
      Exclude:
      <div class="row">
        <div class="col-8">
          <b-form-group>
            <b-form-checkbox-group
              id="checkbox-group-1"
              v-model="exclude"
              :options="options"
              name="exclude"
            ></b-form-checkbox-group>
          </b-form-group>
        </div>
        <div class="col-4 text-right">
          {{ filteredRanking.length }} / {{ ranking.length }}
        </div>
      </div>
      <b-table
        dark
        striped
        hover
        responsive
        stacked="md"
        :fields="fields"
        :items="filteredRanking"
        :per-page="perPage"
        :current-page="currentPage"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
      >
        <template v-slot:cell(name)="data">
          <span v-b-tooltip.hover title="Verified identity">
            <font-awesome-icon
              v-if="data.item.verifiedIdentity"
              icon="check"
              class="text-success verified"
            />
          </span>
          {{ data.item.name }}
        </template>
        <template v-slot:cell(stashAddress)="data">
          <Identicon
            :key="data.item.stashAddress"
            :size="28"
            :theme="'polkadot'"
            :value="data.item.stashAddress"
            class="identicon"
          />
          {{ shortAddress(data.item.stashAddress) }}
        </template>
        <template v-slot:cell(commission)="data">
          {{ data.item.commission }}%
        </template>
      </b-table>
      <div class="row">
        <div class="col-6">
          <b-button-group>
            <b-button
              variant="outline-secondary"
              :class="{ 'text-primary': perPage === 10 }"
              @click="setPageSize(10)"
              >10</b-button
            >
            <b-button
              variant="outline-secondary"
              :class="{ 'text-primary': perPage === 50 }"
              @click="setPageSize(50)"
              >50</b-button
            >
            <b-button
              variant="outline-secondary"
              :class="{ 'text-primary': perPage === 100 }"
              @click="setPageSize(100)"
              >100</b-button
            >
            <b-button
              variant="outline-secondary"
              :class="{ 'text-primary': perPage === 1000 }"
              @click="setPageSize(1000)"
              >All</b-button
            >
          </b-button-group>
        </div>
        <div class="col-6">
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
import Identicon from '@polkadot/vue-identicon'
import commonMixin from '../mixins/commonMixin.js'

export default {
  components: {
    Identicon,
  },
  mixins: [commonMixin],
  data() {
    return {
      perPage: 10,
      currentPage: 1,
      sortBy: 'rank',
      sortDesc: false,
      fields: [
        { key: 'rank', sortable: true },
        { key: 'name', sortable: true },
        { key: 'stashAddress', sortable: true },
        { key: 'nominators', sortable: true, class: 'text-right' },
        { key: 'commission', sortable: true, class: 'text-right' },
      ],
      exclude: [],
      options: [
        { text: '100% commission', value: 'greedy' },
        { text: 'No identity', value: 'noIdentity' },
        { text: 'No verified identity', value: 'noVerifiedIdentity' },
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
          verifiedIdentity: validator.verifiedIdentity,
          stashAddress: validator.accountId,
          nominators: validator.exposure.others.length,
          commission: (validator.validatorPrefs.commission / 10000000).toFixed(
            0
          ),
        }
      })
    },
    filteredRanking() {
      let filteredRanking = this.exclude.includes('greedy')
        ? this.ranking.filter(({ commission }) => commission !== `100`)
        : this.ranking
      filteredRanking = this.exclude.includes('noIdentity')
        ? filteredRanking.filter(({ name }) => name !== '')
        : filteredRanking
      filteredRanking = this.exclude.includes('noVerifiedIdentity')
        ? filteredRanking.filter(({ verifiedIdentity }) => verifiedIdentity)
        : filteredRanking
      return filteredRanking
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
.verified {
  font-size: 0.7rem;
}
</style>
