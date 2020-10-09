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
      <b-tabs content-class="mt-3">
        <b-tab title="Validator ranking" active>
          <h5 class="text-center">Exclude:</h5>
          <div class="row py-3">
            <div
              v-for="option in options"
              :key="option.text"
              class="col-md-3 mb-3"
            >
              <div class="row">
                <div class="col-9">
                  {{ option.text }}
                </div>
                <div class="col-3">
                  <b-form-checkbox
                    switch
                    size="lg"
                    class="text-right"
                    @change="toggleExcluded(option.value)"
                  />
                </div>
              </div>
            </div>
          </div>
          <p class="text-right mb-0">
            {{ filteredRanking.length }} / {{ ranking.length }}
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
          >
            <template v-slot:cell(active)="data">
              <span
                v-if="data.item.active"
                v-b-tooltip.hover
                title="Active validator"
              >
                <font-awesome-icon
                  icon="circle"
                  class="text-success led-green"
                />
              </span>
              <span v-else v-b-tooltip.hover title="Inactive validator">
                <font-awesome-icon icon="circle" class="text-danger led-red" />
              </span>
            </template>
            <template v-slot:cell(name)="data">
              <Identicon
                :key="data.item.stashAddress"
                :size="28"
                :theme="'polkadot'"
                :value="data.item.stashAddress"
                class="identicon"
              />
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
            </template>
            <template v-slot:cell(commission)="data">
              {{ data.item.commission }}%
            </template>
            <template v-slot:cell(selected)="data">
              <p class="text-center mb-0">
                <a
                  class="selected"
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
                :total-rows="rows"
                :per-page="perPage"
                aria-controls="my-table"
                variant="dark"
                align="right"
              ></b-pagination>
            </div>
          </div>
        </b-tab>
        <b-tab title="Selected validators">
          <SelectedValidators :list="selectedValidators" />
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>
<script>
import Identicon from '@polkadot/vue-identicon'
import SelectedValidators from '../components/SelectedValidators.vue'
import commonMixin from '../mixins/commonMixin.js'

export default {
  components: {
    Identicon,
    SelectedValidators,
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
        { key: 'active', sortable: true, class: 'text-center' },
        { key: 'name', sortable: true },
        { key: 'nominators', sortable: true, class: 'text-right' },
        { key: 'commission', sortable: true, class: 'text-right' },
        { key: 'selected', sortable: true, class: 'text-center' },
      ],
      exclude: [],
      options: [
        { text: 'Inactive validators', value: 'inactive' },
        { text: '100% commission', value: 'greedy' },
        { text: 'Slashed', value: 'slashed' },
        { text: 'Oversubscribed', value: 'oversubscribed' },
        { text: 'No identity', value: 'noIdentity' },
        { text: 'No verified identity', value: 'noVerifiedIdentity' },
        { text: 'No auto-payout', value: 'noAutoPayout' },
        {
          text: "Don't participate in governance",
          value: 'noParticipateGovernance',
        },
      ],
      selectedValidatorAddresses: [],
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
        ? filteredRanking.filter(({ commission }) => commission !== `100`)
        : filteredRanking
      filteredRanking = this.exclude.includes('noIdentity')
        ? filteredRanking.filter(({ name }) => name !== '')
        : filteredRanking
      filteredRanking = this.exclude.includes('noVerifiedIdentity')
        ? filteredRanking.filter(({ verifiedIdentity }) => verifiedIdentity)
        : filteredRanking
      return filteredRanking
    },
    rows() {
      return this.filteredRanking.length
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
  },
  async created() {
    if (this.$store.state.ranking.list.length === 0) {
      await this.$store.dispatch('ranking/update')
    }
    if (this.$cookies.get('selectedValidatorAddresses')) {
      this.favorites = this.$cookies.get('selectedValidatorAddresses')
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
      } else {
        this.selectedValidatorAddresses.push(accountId)
      }
    },
    toggleExcluded(value) {
      if (this.exclude.includes(value)) {
        this.exclude.splice(this.exclude.indexOf(value), 1)
      } else {
        this.exclude.push(value)
      }
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
</style>
