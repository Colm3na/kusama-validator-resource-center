<template>
  <div>
    <div v-if="loading">
      <Loading />
    </div>
    <div v-else>
      <b-tabs content-class="mt-5">
        <b-tab title="Ranking" active>
          <!-- Filter -->
          <b-row style="margin-bottom: 1rem">
            <b-col cols="12">
              <b-form-input
                id="filterInput"
                v-model="filter"
                type="search"
                placeholder="Search validator by address or name"
                debounce="500"
              />
            </b-col>
          </b-row>
          <!-- Exclude -->
          <div class="exclude mb-4">
            <h5>Exclude from search:</h5>
            <div class="row pt-3">
              <div
                v-for="option in options"
                :key="option.text"
                class="col-md-3 mb-3"
              >
                <b-form-checkbox
                  switch
                  size="lg"
                  :checked="getExcludeState(option.value)"
                  @change="toggleExcluded(option.value)"
                >
                  {{ option.text }}
                </b-form-checkbox>
              </div>
            </div>
          </div>
          <p class="mb-2 text-secondary">
            Search results: {{ filteredRows }} / {{ ranking.length }}
          </p>
          <b-table
            dark
            hover
            responsive
            stacked="md"
            :fields="fields"
            :items="filteredRanking"
            :per-page="perPage"
            :current-page="currentPage"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :filter="filter"
            :filter-included-fields="filterOn"
            :sort-compare="sortCompare"
            @filtered="onFiltered"
          >
            <template v-slot:cell(active)="data">
              <span
                v-if="data.item.active"
                v-b-tooltip.hover
                title="Active validator"
              >
                <font-awesome-layers>
                  <font-awesome-icon
                    icon="circle"
                    style="
                      color: black;
                      font-size: 1.6rem;
                      border: 2px solid rgb(128 128 128 / 49%);
                      border-radius: 50%;
                    "
                  />
                  <font-awesome-icon
                    icon="circle"
                    class="text-success"
                    style="font-size: 1.05rem; margin-left: 0.266rem"
                    transform="shrink-6"
                  />
                </font-awesome-layers>
              </span>
              <span v-else v-b-tooltip.hover title="Inactive validator">
                <font-awesome-layers>
                  <font-awesome-icon
                    icon="circle"
                    style="
                      color: black;
                      font-size: 1.6rem;
                      border: 2px solid rgb(128 128 128 / 49%);
                      border-radius: 50%;
                    "
                  />
                  <font-awesome-icon
                    icon="circle"
                    class="text-danger"
                    style="font-size: 1.05rem; margin-left: 0.266rem"
                    transform="shrink-6"
                  />
                </font-awesome-layers>
              </span>
            </template>
            <template v-slot:cell(name)="data">
              <Identicon :address="data.item.stashAddress" :size="28" />
              <nuxt-link :to="`/validator/${data.item.stashAddress}`">
                <span v-if="data.item.name">
                  {{ data.item.name }}
                  <span v-b-tooltip.hover title="Verified identity">
                    <font-awesome-icon
                      v-if="data.item.verifiedIdentity"
                      icon="check"
                      class="text-success verified"
                    />
                  </span>
                </span>
                <span v-else>
                  {{ shortAddress(data.item.stashAddress) }}
                </span>
              </nuxt-link>
            </template>
            <template v-slot:cell(commission)="data">
              {{ data.item.commission.toFixed(1) }}%
            </template>

            <template v-slot:cell(selfStake)="data">
              {{ formatAmount(data.item.selfStake) }}
            </template>
            <template v-slot:cell(otherStake)="data">
              {{ formatAmount(data.item.otherStake) }}
            </template>
            <template v-slot:cell(selected)="data">
              <p class="text-center mb-0">
                <a
                  v-b-tooltip.hover
                  class="selected"
                  title="Select / Unselect validator"
                  @click="toggleSelected(data.item.stashAddress)"
                >
                  <font-awesome-icon
                    v-if="data.item.selected"
                    icon="hand-paper"
                    class="text-warning"
                  />
                  <font-awesome-icon
                    v-else
                    icon="hand-paper"
                    class="text-secondary"
                  />
                </a>
              </p>
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
                :total-rows="filteredRows"
                :per-page="perPage"
                aria-controls="my-table"
                variant="dark"
                align="right"
              ></b-pagination>
            </div>
          </div>
        </b-tab>
        <b-tab>
          <template #title>
            Selected
            <font-awesome-icon icon="hand-paper" />
            ({{ selectedValidators.length }})
          </template>
          <SelectedValidators
            :list="selectedValidators"
            @remove="toggleSelected"
          />
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>
<script>
import { BigNumber } from 'bignumber.js'
import SelectedValidators from '../components/SelectedValidators.vue'
import Loading from '../components/Loading.vue'
import Identicon from '../components/Identicon.vue'
import commonMixin from '../mixins/commonMixin.js'

export default {
  components: {
    Identicon,
    SelectedValidators,
    Loading,
  },
  mixins: [commonMixin],
  data() {
    return {
      perPage: 10,
      currentPage: 1,
      sortBy: 'rank',
      sortDesc: false,
      fields: [
        // { key: 'rank', label: '#', sortable: true },
        {
          key: 'active',
          label: 'Status',
          sortable: true,
          class: 'text-center',
        },
        { key: 'name', sortable: true },
        { key: 'nominators', sortable: true },
        { key: 'commission', sortable: true },
        { key: 'selfStake', sortable: true },
        { key: 'otherStake', sortable: true },
        {
          key: 'selected',
          label: 'Select',
          sortable: true,
          class: 'text-center',
        },
      ],
      exclude: [],
      options: [
        { text: 'Inactive', value: 'inactive' },
        { text: '100% commission', value: 'greedy' },
        { text: 'Slashed', value: 'slashed' },
        { text: 'Oversubscribed', value: 'oversubscribed' },
        { text: 'No identity', value: 'noIdentity' },
        { text: 'No verified identity', value: 'noVerifiedIdentity' },
        { text: 'No auto-payout', value: 'noAutoPayout' },
        {
          text: 'Not part of a cluster',
          value: 'notPartOfCluster',
        },
        {
          text: 'No participation in governance',
          value: 'noParticipateGovernance',
        },
      ],
      filter: null,
      filterOn: [],
      rows: 0,
      selectedValidatorAddresses: [],
      maxValidatorsReached: false,
    }
  },
  computed: {
    loading() {
      return this.$store.state.ranking.loading
    },
    ranking() {
      return this.$store.state.ranking.list.map((validator) => {
        return {
          ...validator,
          selected: this.isSelected(validator.stashAddress),
        }
      })
    },
    selectedValidators() {
      return this.ranking.filter(({ stashAddress }) =>
        this.selectedValidatorAddresses.includes(stashAddress)
      )
    },
    filteredRanking() {
      let filteredRanking = this.exclude.includes('inactive')
        ? this.ranking.filter(({ active }) => active)
        : this.ranking
      filteredRanking = this.exclude.includes('greedy')
        ? filteredRanking.filter(({ commission }) => commission !== 100)
        : filteredRanking
      filteredRanking = this.exclude.includes('noIdentity')
        ? filteredRanking.filter(({ name }) => name !== '')
        : filteredRanking
      filteredRanking = this.exclude.includes('noVerifiedIdentity')
        ? filteredRanking.filter(({ verifiedIdentity }) => verifiedIdentity)
        : filteredRanking
      filteredRanking = this.exclude.includes('noAutoPayout')
        ? filteredRanking.filter(({ payoutRating }) => payoutRating === 3)
        : filteredRanking
      filteredRanking = this.exclude.includes('noParticipateGovernance')
        ? filteredRanking.filter(
            ({ governanceRating }) => governanceRating === 2
          )
        : filteredRanking
      filteredRanking = this.exclude.includes('notPartOfCluster')
        ? filteredRanking.filter(({ partOfCluster }) => !partOfCluster)
        : filteredRanking
      return filteredRanking
    },
    filteredRows() {
      return this.filter ? this.rows : this.filteredRanking.length
    },
  },
  watch: {
    selectedValidatorAddresses(selectedValidatorAddresses) {
      this.$cookies.set(
        'selectedValidatorAddresses',
        selectedValidatorAddresses,
        {
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        }
      )
    },
    exclude(exclude) {
      this.$cookies.set('exclude', exclude, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
    },
  },
  async created() {
    if (this.$store.state.ranking.list.length === 0) {
      await this.$store.dispatch('ranking/update')
    }
    if (this.$cookies.get('selectedValidatorAddresses')) {
      this.selectedValidatorAddresses = this.$cookies.get(
        'selectedValidatorAddresses'
      )
    }
    if (this.$cookies.get('exclude')) {
      this.exclude = this.$cookies.get('exclude')
    }
  },
  methods: {
    setPageSize(size) {
      this.perPage = size
    },
    isSelected(accountId) {
      return this.selectedValidatorAddresses.includes(accountId)
    },
    toggleSelected(accountId) {
      if (this.selectedValidatorAddresses.includes(accountId)) {
        this.selectedValidatorAddresses.splice(
          this.selectedValidatorAddresses.indexOf(accountId),
          1
        )
      } else if (this.selectedValidatorAddresses.length < 16) {
        this.selectedValidatorAddresses.push(accountId)
      } else {
        this.$bvToast.toast('Please remove before selecting a new one', {
          title: 'Select up to 16 validators',
          variant: 'danger',
          autoHideDelay: 5000,
          appendToast: false,
        })
      }
    },
    toggleExcluded(value) {
      if (this.exclude.includes(value)) {
        this.exclude.splice(this.exclude.indexOf(value), 1)
      } else {
        this.exclude.push(value)
      }
    },
    getExcludeState(value) {
      if (this.exclude.includes(value)) {
        return true
      }
      return false
    },
    onFiltered(filteredItems) {
      this.rows = filteredItems.length
      this.currentPage = 1
    },
    sortCompare(aRow, bRow, key) {
      const a = aRow[key]
      const b = bRow[key]
      if (a instanceof BigNumber && b instanceof BigNumber) {
        return a.lt(b) ? -1 : 1
      } else if (typeof a === 'number' && typeof b === 'number') {
        return a < b ? -1 : 1
      }
      return a.toString().localeCompare(b.toString())
    },
  },
}
</script>
<style>
.verified {
  font-size: 0.7rem;
}
.led-green {
  border-radius: 50%;
  box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #304701 0 -1px 9px,
    #89ff00 0 2px 12px;
}
.led-red {
  border-radius: 50%;
  box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #441313 0 -1px 9px,
    rgba(255, 0, 0, 1) 0 2px 12px;
}
.selected {
  cursor: pointer;
}
.custom-switch.b-custom-control-lg .custom-control-label,
.input-group-lg .custom-switch .custom-control-label {
  font-size: 0.9rem;
}
.exclude {
  padding: 1rem 1rem 0.5rem 1rem;
  border: 1px solid #e6007a;
}
.exclude h5 {
  font-size: 1rem;
  color: gray;
}
</style>
