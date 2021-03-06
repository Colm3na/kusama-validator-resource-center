<template>
  <div>
    <div v-if="loading">
      <Loading />
    </div>
    <div v-else class="ranking">
      <!-- Selected validators  -->
      <b-row v-if="config.showValSelectorInPage">
        <b-col offset-lg="9" cols="12" lg="3">
          <b-dropdown
            id="selected-validators"
            ref="selectedValidators"
            class="selected-validators"
            toggle-class="btn btn-block btn-selected mb-3"
            right
          >
            <template #button-content>
              <span v-if="loading">Selected</span>
              <span v-else>
                {{ selectedValidatorAddresses.length }}/16 selected
              </span>
              <font-awesome-icon icon="hand-paper" />
            </template>
            <SelectedValidators />
          </b-dropdown>
        </b-col>
      </b-row>
      <!-- Exclude -->
      <div class="exclude mb-4">
        <h5 class="exclude-title">Exclude from search:</h5>
        <div class="row pt-3">
          <div
            v-for="option in options"
            :key="option.text"
            class="col-md-6 col-lg-3 mb-2"
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
      <!-- Filter -->
      <b-row>
        <b-col cols="12">
          <b-form-input
            id="filterInput"
            v-model="filter"
            type="search"
            placeholder="Search validator by address or name"
            debounce="500"
            class="mb-3"
          />
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="6">
          <p class="mb-2 text-secondary">
            Search results: {{ filteredRows }} / {{ ranking.length }}
          </p>
        </b-col>
        <b-col cols="6" class="text-right">
          <JsonCSV
            :data="rankingJSON"
            class="csv-export mb-2"
            name="kusama_validator_ranking.csv"
          >
            <font-awesome-icon icon="file-csv" />
            export to CSV file
          </JsonCSV>
        </b-col>
      </b-row>
      <b-table
        dark
        hover
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
        <template #cell(active)="data">
          <span
            v-if="data.item.active"
            v-b-tooltip.hover
            title="Elected validator"
          >
            <font-awesome-layers class="align-middle">
              <font-awesome-icon icon="circle" class="elected-icon" />
              <font-awesome-icon
                icon="circle"
                class="text-success"
                style="font-size: 1.05rem; margin-left: 0.266rem"
                transform="shrink-6"
              />
            </font-awesome-layers>
          </span>
          <span v-else v-b-tooltip.hover title="Not elected validator">
            <font-awesome-layers>
              <font-awesome-icon icon="circle" class="not-elected-icon" />
              <font-awesome-icon
                icon="circle"
                class="text-danger"
                style="font-size: 1.05rem; margin-left: 0.266rem"
                transform="shrink-6"
              />
            </font-awesome-layers>
          </span>
        </template>
        <template #cell(name)="data">
          <!-- desktop -->
          <div class="d-none d-sm-none d-md-none d-lg-block d-xl-block">
            <Identicon :address="data.item.stashAddress" :size="24" />
            <nuxt-link :to="`/validator/${data.item.stashAddress}`">
              <span v-if="data.item.name">{{ data.item.name }}</span>
              <span v-else>{{ shortAddress(data.item.stashAddress) }}</span>
            </nuxt-link>
            <VerifiedIcon v-if="data.item.verifiedIdentity" />
          </div>
          <!-- mobile -->
          <div class="d-block d-sm-block d-md-block d-lg-none d-xl-none">
            <b-row>
              <b-col cols="10">
                <Identicon :address="data.item.stashAddress" :size="24" />
                <nuxt-link :to="`/validator/${data.item.stashAddress}`">
                  <span v-if="data.item.name">{{ data.item.name }}</span>
                  <span v-else>{{ shortAddress(data.item.stashAddress) }}</span>
                </nuxt-link>
                <VerifiedIcon v-if="data.item.verifiedIdentity" />
              </b-col>
              <b-col cols="2">
                <a
                  v-b-tooltip.hover
                  class="select"
                  title="Select / Unselect validator"
                  @click="toggleSelected(data.item.stashAddress)"
                >
                  <font-awesome-icon
                    v-if="data.item.selected"
                    icon="hand-paper"
                    class="selected text-selected"
                  />
                  <font-awesome-icon
                    v-else
                    icon="hand-paper"
                    class="unselected text-secondary"
                  />
                </a>
              </b-col>
            </b-row>
          </div>
        </template>
        <template #cell(commission)="data">
          {{ data.item.commission.toFixed(1) }}%
        </template>

        <template #cell(selfStake)="data">
          {{ formatAmount(data.item.selfStake) }}
        </template>
        <template #cell(otherStake)="data">
          {{ formatAmount(data.item.otherStake) }}
        </template>
        <template #cell(selected)="data">
          <p class="text-center mb-0">
            <a
              v-b-tooltip.hover
              class="select"
              title="Select / Unselect validator"
              @click="toggleSelected(data.item.stashAddress)"
            >
              <font-awesome-icon
                v-if="data.item.selected"
                icon="hand-paper"
                class="selected text-selected"
              />
              <font-awesome-icon
                v-else
                icon="hand-paper"
                class="unselected text-secondary"
              />
            </a>
          </p>
        </template>
      </b-table>
      <div class="row">
        <div class="col-6">
          <!-- desktop -->
          <div class="d-none d-sm-none d-md-none d-lg-block d-xl-block">
            <b-button-group>
              <b-button
                variant="outline-secondary"
                :class="{ 'selected-per-page': perPage === 10 }"
                @click="setPageSize(10)"
                >10</b-button
              >
              <b-button
                variant="outline-secondary"
                :class="{ 'selected-per-page': perPage === 50 }"
                @click="setPageSize(50)"
                >50</b-button
              >
              <b-button
                variant="outline-secondary"
                :class="{ 'selected-per-page': perPage === 100 }"
                @click="setPageSize(100)"
                >100</b-button
              >
              <b-button
                variant="outline-secondary"
                :class="{ 'selected-per-page': perPage === 1000 }"
                @click="setPageSize(1000)"
                >All</b-button
              >
            </b-button-group>
          </div>
          <!-- mobile -->
          <div class="d-block d-sm-block d-md-block d-lg-none d-xl-none">
            <b-dropdown
              class="m-md-2"
              text="Page size"
              variant="outline-secondary"
            >
              <b-dropdown-item @click="setPageSize(10)">10</b-dropdown-item>
              <b-dropdown-item @click="setPageSize(50)">50</b-dropdown-item>
              <b-dropdown-item @click="setPageSize(100)">100</b-dropdown-item>
              <b-dropdown-item @click="setPageSize(1000)">All</b-dropdown-item>
            </b-dropdown>
          </div>
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
    </div>
  </div>
</template>
<script>
import { BigNumber } from 'bignumber.js'
import JsonCSV from 'vue-json-csv'
import Loading from '@/components/Loading.vue'
import Identicon from '@/components/Identicon.vue'
import VerifiedIcon from '@/components/VerifiedIcon.vue'
import SelectedValidators from '@/components/SelectedValidators.vue'
import commonMixin from '@/mixins/commonMixin.js'
import { config } from '@/config.js'

export default {
  components: {
    Identicon,
    VerifiedIcon,
    SelectedValidators,
    Loading,
    JsonCSV,
  },
  mixins: [commonMixin],
  data() {
    return {
      perPage: 10,
      currentPage: 1,
      sortBy: 'rank',
      sortDesc: false,
      fields: [
        {
          key: 'active',
          label: 'Elected',
          sortable: true,
          class:
            'text-center d-none d-sm-none d-md-none d-lg-table-cell d-xl-table-cell',
        },
        { key: 'name', sortable: true },
        {
          key: 'nominators',
          sortable: true,
          class: 'd-none d-sm-none d-md-none d-lg-table-cell d-xl-table-cell',
        },
        {
          key: 'commission',
          sortable: true,
          class: 'd-none d-sm-none d-md-none d-lg-table-cell d-xl-table-cell',
        },
        {
          key: 'selfStake',
          sortable: true,
          class: 'd-none d-sm-none d-md-none d-lg-table-cell d-xl-table-cell',
        },
        {
          key: 'otherStake',
          sortable: true,
          class: 'd-none d-sm-none d-md-none d-lg-table-cell d-xl-table-cell',
        },
        {
          key: 'selected',
          label: 'Select',
          sortable: true,
          class:
            'text-center d-none d-sm-none d-md-none d-lg-table-cell d-xl-table-cell',
        },
      ],
      exclude: [],
      options: [
        { text: 'Not elected', value: 'inactive' },
        { text: '100% commission', value: 'greedy' },
        { text: 'Slashed', value: 'slashed' },
        { text: 'Oversubscribed', value: 'oversubscribed' },
        { text: 'No identity', value: 'noIdentity' },
        { text: 'No verified identity', value: 'noVerifiedIdentity' },
        { text: 'No auto-payout', value: 'noAutoPayout' },
        {
          text: 'Below average era points',
          value: 'belowAverageEraPoints',
        },
        {
          text: 'No participation in governance',
          value: 'noParticipateGovernance',
        },
      ],
      filter: null,
      filterOn: [],
      rows: 0,
      maxValidatorsReached: false,
      polling: null,
      config,
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
    rankingJSON() {
      return this.$store.state.ranking.list.map((validator) => {
        return {
          rank: validator.rank,
          name: validator.name,
          stash_address: validator.stashAddress,
          controller_address: validator.controllerAddress,
          active: validator.active ? 'active' : 'inactive',
          active_rating: validator.activeRating,
          self_stake: validator.selfStake,
          other_stake: validator.otherStake,
          total_stake: validator.totalStake,
          has_sub_identity: validator.hasSubIdentity ? 'yes' : 'no',
          sub_accounts_rating: validator.subAccountsRating,
          verified_identity: validator.verifiedIdentity ? 'yes' : 'no',
          identity_rating: validator.identityRating,
          commission: validator.commission,
          commission_history: validator.commissionHistory,
          commission_rating: validator.commissionRating,
          nominators: validator.nominators,
          nominators_rating: validator.nominatorsRating,
          era_points_history: validator.eraPointsHistory,
          era_points_percentage: validator.eraPointsPercent,
          era_points_rating: validator.eraPointsRating,
          slashed: validator.slashed ? 'yes' : 'no',
          slashes: validator.slashes,
          slash_rating: validator.slashRating,
          part_of_a_cluster: validator.partOfCluster ? 'yes' : 'no',
          cluster_name: validator.clusterName,
          cluster_members: validator.clusterMembers,
          council_backing: validator.councilBacking ? 'yes' : 'no',
          active_in_governance: validator.activeInGovernance ? 'yes' : 'no',
          governance_rating: validator.governanceRating,
          payout_history: validator.payoutHistory,
          payout_rating: validator.payoutRating,
          total_rating: validator.totalRating,
          selected: this.isSelected(validator.stashAddress) ? 'yes' : 'no',
        }
      })
    },
    selectedValidatorAddresses() {
      return this.$store.state.ranking.selectedAddresses
    },
    selectedValidators() {
      return this.ranking.filter(({ stashAddress }) =>
        this.$store.state.ranking.selectedAddresses.includes(stashAddress)
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
            ({ governanceRating }) => governanceRating !== 0
          )
        : filteredRanking
      filteredRanking = this.exclude.includes('belowAverageEraPoints')
        ? filteredRanking.filter(({ eraPointsRating }) => eraPointsRating === 2)
        : filteredRanking
      return filteredRanking
    },
    filteredRows() {
      return this.filter ? this.rows : this.filteredRanking.length
    },
  },
  watch: {
    exclude(exclude) {
      this.$cookies.set(`${config.name}-exclude`, exclude, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
    },
  },
  async created() {
    if (this.$store.state.ranking.list.length === 0) {
      await this.$store.dispatch('ranking/update')
    }
    if (this.$cookies.get(`${config.name}-exclude`)) {
      this.exclude = this.$cookies.get(`${config.name}-exclude`)
    }
    if (this.$cookies.get(`${config.name}-filter`)) {
      this.filter = this.$cookies.get(`${config.name}-filter`)
    }
    // update ranking every 30 min
    this.polling = setInterval(async () => {
      // eslint-disable-next-line
      console.log('refreshing...')
      await this.$store.dispatch('ranking/update')
    }, 1800 * 1000)
  },
  beforeDestroy() {
    clearInterval(this.polling)
  },
  methods: {
    setPageSize(size) {
      this.perPage = size
    },
    isSelected(accountId) {
      return this.selectedValidatorAddresses.includes(accountId)
    },
    toggleSelected(accountId) {
      this.$store.dispatch('ranking/toggleSelected', { accountId })
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
      // update cookie
      this.$cookies.set(`${config.name}-filter`, this.filter, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
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
