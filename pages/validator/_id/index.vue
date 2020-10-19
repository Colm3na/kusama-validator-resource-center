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
              <span v-b-tooltip.hover title="Verified identity">
                <font-awesome-icon
                  v-if="validator.verifiedIdentity"
                  icon="check"
                  class="text-success"
                />
              </span>
            </span>
            <span v-else>
              {{ shortAddress(accountId) }}
            </span>
          </h1>
        </div>
        <div class="col-2 text-right mt-4">
          <a
            v-b-tooltip.hover
            class="selected"
            title="Select / Unselect validator"
            @click="toggleSelected(validator.stashAddress)"
          >
            <font-awesome-icon
              v-if="isSelected(validator.stashAddress)"
              icon="hand-paper"
              class="fa-2x text-warning"
            />
            <font-awesome-icon
              v-else
              icon="hand-paper"
              class="fa-2x text-secondary"
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
              <Address :accountId="validator.stashAddress" />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-5">
              <Slashes
                :slashed="validator.slashed"
                :slashes="validator.slashes"
              />
            </div>
            <div class="col-md-6 mb-5">
              <div class="row">
                <div class="col-9">
                  <h4 class="mb-0">Subaccounts</h4>
                </div>
                <div class="col-3 text-right">
                  <span v-if="validator.hasSubIdentity">
                    <font-awesome-icon
                      icon="check"
                      class="text-success verified"
                    />
                    Good
                  </span>
                  <span v-else>
                    <font-awesome-icon
                      icon="minus-circle"
                      class="text-danger verified"
                    />
                    Bad
                  </span>
                </div>
              </div>
              <hr />
              <p v-if="validator.hasSubIdentity">Good! Detected sub-identity</p>
              <p v-else>Bad! No sub-identity detected</p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-5">
              <div class="row">
                <div class="col-9">
                  <h4 class="mb-0">Nominators</h4>
                </div>
                <div class="col-3 text-right text-danger">
                  <font-awesome-icon icon="minus-circle" class="verified" />
                  Bad
                </div>
              </div>
              <hr />
              <p>Detected {{ validator.nominators }} nominator/s</p>
            </div>
            <div class="col-md-6 mb-5">
              <div class="row">
                <div class="col-9">
                  <h4 class="mb-0">Era points</h4>
                </div>
                <div class="col-3 text-right text-success">
                  <font-awesome-icon
                    icon="check"
                    class="text-success verified"
                  />
                  Good
                </div>
              </div>
              <hr />
              <p>On average</p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-5">
              <div class="row">
                <div class="col-9">
                  <h4 class="mb-0">Commission</h4>
                </div>
                <div class="col-3 text-right text-success">
                  <font-awesome-icon
                    icon="check"
                    class="text-success verified"
                  />
                  Good
                </div>
              </div>
              <hr />
              <p>
                Very Good! commission &lt; 10% but > 5% and decreased over time
              </p>
            </div>
            <div class="col-md-6 mb-5">
              <div class="row">
                <div class="col-9">
                  <h4 class="mb-0">Frequency of payouts</h4>
                </div>
                <div class="col-3 text-right text-success">
                  <font-awesome-icon
                    icon="check"
                    class="text-success verified"
                  />
                  Good
                </div>
              </div>
              <hr />
              <p>Good! Last payout was yesterday</p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-5">
              <div class="row">
                <div class="col-9">
                  <h4 class="mb-0">Governance participation</h4>
                </div>
                <div class="col-3 text-right text-success">
                  <font-awesome-icon
                    icon="check"
                    class="text-success verified"
                  />
                  Good
                </div>
              </div>
              <hr />
              <p>Good! The validator is participating</p>
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

<style>
.validator-page .metric {
  min-height: 10rem;
}
.validator-page .card-body {
  position: relative;
}
</style>
