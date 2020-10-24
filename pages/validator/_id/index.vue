<template>
  <div class="validator-page container pt-3">
    <div v-if="loading">
      <Loading />
    </div>
    <div v-else>
      <div class="row">
        <div class="col-10">
          <h1 class="mt-3 mb-4">
            <Identicon :address="accountId" :size="64" />
            <span v-if="validator.name">
              {{ validator.name }}
              <VerifiedIcon size="lg" v-if="validator.verifiedIdentity" />
            </span>
            <span v-else>
              {{ shortAddress(accountId) }}
            </span>
          </h1>
        </div>
        <div class="col-2 text-right mt-4">
          <a
            v-b-tooltip.hover
            class="select"
            title="Select / Unselect validator"
            @click="toggleSelected(validator.stashAddress)"
          >
            <font-awesome-icon
              v-if="isSelected(validator.stashAddress)"
              icon="hand-paper"
              class="selected fa-2x text-selected"
            />
            <font-awesome-icon
              v-else
              icon="hand-paper"
              class="unselected fa-2x text-secondary"
            />
          </a>
        </div>
      </div>
      <b-tabs content-class="py-4">
        <b-tab title="Chain data" active>
          <b-alert
            show
            dismissible
            variant="info"
            class="text-center py-3 glitch"
          >
            This information is verified and provided by historical data on the
            Kusama blockchain
          </b-alert>
          <div class="row pt-4">
            <div class="col-md-6 mb-5">
              <Identity
                :identity="validator.identity"
                :rating="validator.identityRating"
              />
            </div>
            <div class="col-md-6 mb-5">
              <Address :account-id="validator.stashAddress" />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-5">
              <Slashes
                :slashes="validator.slashes"
                :rating="validator.slashRating"
              />
            </div>
            <div class="col-md-6 mb-5">
              <Subaccounts :rating="validator.subAccountsRating" />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-5">
              <Nominators
                :nominators="validator.nominators"
                :rating="validator.nominatorsRating"
              />
            </div>
            <div class="col-md-6 mb-5">
              <EraPoints
                :percent="validator.eraPointsPercent"
                :rating="validator.eraPointsRating"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-5">
              <Commission
                :commission="validator.commission"
                :rating="validator.commissionRating"
              />
            </div>
            <div class="col-md-6 mb-5">
              <Payouts
                :payout-history="validator.payoutHistory"
                :rating="validator.payoutsRating"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-5">
              <Governance
                :council-backing="validator.councilBacking"
                :rating="validator.governanceRating"
              />
            </div>
            <div class="col-md-6 mb-5"></div>
          </div>
        </b-tab>
        <b-tab title="Additional data">
          <b-alert
            show
            dismissible
            variant="info"
            class="text-center py-3 glitch"
          >
            This information is unverified and provided by the validator
          </b-alert>
          <Additional :address="validator.stashAddress" />
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import Identicon from '../../../components/Identicon.vue'
import Loading from '../../../components/Loading.vue'
import Additional from '../../../components/Additional.vue'
import VerifiedIcon from '../../../components/VerifiedIcon.vue'
import Identity from '../../../components/metrics/Identity.vue'
import Address from '../../../components/metrics/Address.vue'
import Slashes from '../../../components/metrics/Slashes.vue'
import Subaccounts from '../../../components/metrics/Subaccounts.vue'
import Nominators from '../../../components/metrics/Nominators.vue'
import EraPoints from '../../../components/metrics/EraPoints.vue'
import Commission from '../../../components/metrics/Commission.vue'
import Payouts from '../../../components/metrics/Payouts.vue'
import Governance from '../../../components/metrics/Governance.vue'
import commonMixin from '../../../mixins/commonMixin.js'

export default {
  components: {
    Identicon,
    Loading,
    Additional,
    VerifiedIcon,
    Identity,
    Address,
    Slashes,
    Subaccounts,
    Nominators,
    EraPoints,
    Commission,
    Payouts,
    Governance,
  },
  mixins: [commonMixin],
  data() {
    return {
      accountId: this.$route.params.id,
      selectedValidatorAddresses: [],
    }
  },
  computed: {
    loading() {
      return this.$store.state.ranking.loading
    },
    validator() {
      const validator = this.$store.state.ranking.list.find(
        (validator) => validator.stashAddress === this.accountId
      )
      return {
        ...validator,
        selected: this.isSelected(validator.stashAddress),
      }
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
      this.selectedValidatorAddresses = this.$cookies.get(
        'selectedValidatorAddresses'
      )
    }
  },
  methods: {
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
  },
}
</script>

<style lang="scss">
.validator-page .metric {
  min-height: 10rem;
}
.validator-page .card-body {
  position: relative;
}

.validator-page .verified {
  font-size: 2rem;
  cursor: pointer;
}
.metric {
  border: 1px solid gray;
  padding: 1rem;
}
.metric .description {
  color: var(--light);
}
</style>
