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
      <b-tabs content-class="mt-3 pt-4">
        <b-tab title="Chain data" active>
          <div class="row">
            <div class="col-md-6 mb-5">
              <div class="row">
                <div class="col-8">
                  <h4 class="mb-0">Identity</h4>
                </div>
                <div class="col-4 text-right text-success">
                  <font-awesome-icon
                    icon="check"
                    class="text-success verified"
                  />
                  Very good
                </div>
              </div>
              <hr />
              <div v-if="validator.identity.legal" class="row">
                <div class="col-md-3">Legal name:</div>
                <div class="col-md-9">
                  {{ validator.identity.legal }}
                </div>
              </div>
              <div v-if="validator.identity.email" class="row">
                <div class="col-md-3">Email:</div>
                <div class="col-md-9">
                  <a
                    :href="`mailto:${validator.identity.email}`"
                    target="_blank"
                  >
                    {{ validator.identity.email }}
                  </a>
                </div>
              </div>
              <div v-if="validator.identity.web" class="row">
                <div class="col-md-3">Web:</div>
                <div class="col-md-9">
                  <a :href="validator.identity.web" target="_blank">
                    {{ validator.identity.web }}
                  </a>
                </div>
              </div>
              <div v-if="validator.identity.twitter" class="row">
                <div class="col-md-3">Twitter:</div>
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
                <div class="col-md-3">Element:</div>
                <div class="col-md-9">
                  <a href="https://app.element.io/" target="_blank">
                    {{ validator.identity.riot }}
                  </a>
                </div>
              </div>
            </div>
            <div class="col-md-6 mb-5">
              <div class="row">
                <div class="col-9">
                  <h4 class="mb-0">Address creation</h4>
                </div>
                <div class="col-3 text-right text-success">
                  <font-awesome-icon
                    icon="check"
                    class="text-success verified"
                  />
                  Very good
                </div>
              </div>
              <hr />
              <p>Address was created at block #20,000 (2020-10-10 12:31:49)</p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-5">
              <div class="row">
                <div class="col-9">
                  <h4 class="mb-0">Slashes</h4>
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
              <p>Good! No slashes detected</p>
            </div>
            <div class="col-md-6 mb-5">
              <div class="row">
                <div class="col-9">
                  <h4 class="mb-0">Subaccounts</h4>
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
              <p>Good! Detected sub-identity</p>
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
              <p>Detected {{ validator.nominators }} nominators</p>
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
          <p>Additional data provided by the validator</p>
        </b-tab>
      </b-tabs>
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
