<template>
  <div class="validator-page container pt-3">
    <div v-if="loading">
      <Loading />
    </div>
    <div v-else>
      <h1 class="text-center my-3">
        <Identicon
          :key="accountId"
          :size="64"
          :theme="'polkadot'"
          :value="accountId"
          class="identicon"
        />
        Validator {{ shortAddress(accountId) }}
      </h1>
      <!-- <pre class="text-white">{{ JSON.stringify(validator, null, 2) }}</pre> -->
      <b-card-group deck>
        <b-card bg-variant="dark" text-variant="white" title="Identity">
          <div v-if="validator.identity.legal" class="row">
            <div class="col-md-3 text-right">Legal name:</div>
            <div class="col-md-9">
              {{ validator.identity.legal }}
            </div>
          </div>
          <div v-if="validator.identity.email" class="row">
            <div class="col-md-3 text-right">Email:</div>
            <div class="col-md-9">
              <a :href="`mailto:${validator.identity.email}`" target="_blank">
                {{ validator.identity.email }}
              </a>
            </div>
          </div>
          <div v-if="validator.identity.web" class="row">
            <div class="col-md-3 text-right">Web:</div>
            <div class="col-md-9">
              <a :href="validator.identity.web" target="_blank">
                {{ validator.identity.web }}
              </a>
            </div>
          </div>
          <div v-if="validator.identity.twitter" class="row">
            <div class="col-md-3 text-right">Twitter:</div>
            <div class="col-md-9">
              <a
                :href="`https://twitter.com/${validator.identity.twitter.substring(
                  1
                )}`"
                target="_blank"
              >
                {{ validator.identity.twitter }}
              </a>
            </div>
          </div>
          <div v-if="validator.identity.riot" class="row">
            <div class="col-md-3 text-right">Element:</div>
            <div class="col-md-9">
              <a href="https://app.element.io/" target="_blank">
                {{ validator.identity.riot }}
              </a>
            </div>
          </div>
        </b-card>
        <b-card bg-variant="dark" text-variant="white" title="Address creation">
          <span class="rating">Very Good!</span>
          <p>Address was created at block #20,000 (2020-10-10 12:31:49)</p>
        </b-card>
      </b-card-group>
      <b-card-group deck class="mt-4">
        <b-card bg-variant="dark" text-variant="white" title="Slashes">
          <p>Good! No slashes detected</p>
        </b-card>
        <b-card bg-variant="dark" text-variant="white" title="Subaccounts">
          <p>Good! Detected sub-identity</p>
        </b-card>
      </b-card-group>
      <b-card-group deck class="mt-4">
        <b-card
          bg-variant="dark"
          text-variant="white"
          title="Number of nominators"
        >
          <p>Good! Detected {{ validator.nominators }} nominators</p>
        </b-card>
        <b-card
          bg-variant="dark"
          text-variant="white"
          title="Average era points"
        >
          <p>Good! On average</p>
        </b-card>
      </b-card-group>
      <b-card-group deck class="mt-4">
        <b-card bg-variant="dark" text-variant="white" title="Commission">
          <p>Very Good! commission &lt; 10% but > 5% and decreased over time</p>
        </b-card>
        <b-card
          bg-variant="dark"
          text-variant="white"
          title="Frequency of payouts"
        >
          <p>Good! Last payout was yesterday</p>
        </b-card>
      </b-card-group>
      <b-card-group deck class="mt-4">
        <b-card
          bg-variant="dark"
          text-variant="white"
          title="Governance participation"
        >
          <p>Good! The validator is participating</p>
        </b-card>
      </b-card-group>
    </div>
  </div>
</template>

<script>
import Identicon from '@polkadot/vue-identicon'
import Loading from '../../components/Loading.vue'
import commonMixin from '../../mixins/commonMixin.js'

export default {
  components: {
    Identicon,
    Loading,
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
.validator .card-body {
  position: relative;
}
.validator .rating {
  position: absolute;
  top: 0px;
  right: 0px;
  color: green;
}
</style>
