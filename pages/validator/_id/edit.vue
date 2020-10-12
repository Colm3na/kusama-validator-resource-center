<template>
  <div class="validator-page container pt-3">
    <div v-if="loading">
      <Loading />
    </div>
    <div v-else>
      <h1 class="mt-3 mb-4">
        <Identicon
          :key="accountId"
          :size="64"
          :theme="'polkadot'"
          :value="accountId"
          class="identicon"
        />
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
      <h5 class="mb-5">Edit qualitative information</h5>
      <b-form @submit="onSubmit">
        <label for="architecture">Validator architecture</label>
        <b-form-textarea
          id="architecture"
          v-model="data.architecture"
          placeholder="Please describe..."
          rows="3"
          max-rows="6"
          class="mb-4"
        ></b-form-textarea>

        <label for="automation"
          >How do you automate things / what tools do you use?</label
        >
        <b-form-textarea
          id="automation"
          v-model="data.automation"
          placeholder="Please describe..."
          rows="3"
          max-rows="6"
          class="mb-4"
        ></b-form-textarea>

        <label for="metrics">
          What approaches does the validator use for logging, metrics,
          monitoring, and observability
        </label>
        <b-form-textarea
          id="metrics"
          v-model="data.metrics"
          placeholder="Please describe..."
          rows="3"
          max-rows="6"
          class="mb-4"
        ></b-form-textarea>

        <label for="monitoringDescription">
          Monitoring and alert system in place?
        </label>
        <b-form-radio-group
          v-model="data.monitoring"
          :options="['Yes', 'No']"
          name="radio-inline"
          class="mb-4"
        ></b-form-radio-group>

        <label for="monitoringDescription">
          How does the validator alert when things go wrong: monitoring system
        </label>
        <b-form-textarea
          id="monitoringDescription"
          v-model="data.monitoringDescription"
          placeholder="Please describe..."
          rows="3"
          max-rows="6"
          class="mb-4"
        ></b-form-textarea>

        <label for="keyHandling">Keyhandling policies</label>
        <b-form-textarea
          id="keyHandling"
          v-model="data.keyHandling"
          placeholder="Please describe..."
          rows="3"
          max-rows="6"
          class="mb-4"
        ></b-form-textarea>

        <label for="highAvailability"
          >Failover and or high availability approaches</label
        >
        <b-form-textarea
          id="highAvailability"
          v-model="data.highAvailability"
          placeholder="Please describe..."
          rows="3"
          max-rows="6"
          class="mb-4"
        ></b-form-textarea>

        <label for="upgradeProcedure"
          >Scenario runbooks (how do they upgrade, how do they migrate
          servers)</label
        >
        <b-form-textarea
          id="upgradeProcedure"
          v-model="data.upgradeProcedure"
          placeholder="Please describe..."
          rows="3"
          max-rows="6"
          class="mb-4"
        ></b-form-textarea>

        <label for="providers">Which providers does the validator use?</label>
        <b-form-textarea
          id="providers"
          v-model="data.providers"
          placeholder="Please describe..."
          rows="3"
          max-rows="6"
          class="mb-4"
        ></b-form-textarea>

        <label for="RBAC"
          >Role Based Access Control Policies (who has access to the
          infrastructure, who can make changes, etc)</label
        >
        <b-form-textarea
          id="RBAC"
          v-model="data.RBAC"
          placeholder="Please describe..."
          rows="3"
          max-rows="6"
          class="mb-4"
        ></b-form-textarea>

        <label for="stakeAutomation"
          >Stake management automation (how does the validator determine the
          efficiency of their own stake)</label
        >
        <b-form-textarea
          id="stakeAutomation"
          v-model="data.stakeAutomation"
          placeholder="Please describe..."
          rows="3"
          max-rows="6"
          class="mb-4"
        ></b-form-textarea>

        <label for="DDoSProtection">DDoS Protection</label>
        <b-form-textarea
          id="DDoSProtection"
          v-model="data.DDoSProtection"
          placeholder="Please describe..."
          rows="3"
          max-rows="6"
          class="mb-4"
        ></b-form-textarea>

        <label for="communication"
          >Communication - how does the validator actively communicate with its
          nominators, what channels / platforms do they use</label
        >
        <b-form-textarea
          id="communication"
          v-model="data.communication"
          placeholder="Please describe..."
          rows="3"
          max-rows="6"
          class="mb-4"
        ></b-form-textarea>

        <label for="communication"
          >Communication - how does the validator actively communicate with its
          nominators, what channels / platforms do they use</label
        >
        <b-form-textarea
          id="communication"
          v-model="data.communication"
          placeholder="Please describe..."
          rows="3"
          max-rows="6"
          class="mb-4"
        ></b-form-textarea>

        <label for="education"
          >Does the validator produce education content? (blog posts and
          tutorials)</label
        >
        <b-form-textarea
          id="education"
          v-model="data.education"
          placeholder="Please describe..."
          rows="3"
          max-rows="6"
          class="mb-4"
        ></b-form-textarea>

        <label for="regions"
          >Which regions does the validator operate in?</label
        >
        <b-form-textarea
          id="regions"
          v-model="data.regions"
          placeholder="Please describe..."
          rows="3"
          max-rows="6"
          class="mb-4"
        ></b-form-textarea>

        <label for="supportChannels"
          >Does the validator offer support in Riot / Telegram / other
          platforms?</label
        >
        <b-form-textarea
          id="supportChannels"
          v-model="data.supportChannels"
          placeholder="Please describe..."
          rows="3"
          max-rows="6"
          class="mb-4"
        ></b-form-textarea>

        <label for="contributions"
          >Does the validator contribute with open source tools? Must include
          links to the repositories</label
        >
        <b-form-textarea
          id="contributions"
          v-model="data.contributions"
          placeholder="Please describe..."
          rows="3"
          max-rows="6"
          class="mb-4"
        ></b-form-textarea>

        <b-button type="submit" variant="outline-primary" block
          >Submit</b-button
        >
      </b-form>
    </div>
  </div>
</template>

<script>
import Identicon from '@polkadot/vue-identicon'
import Loading from '../../../components/Loading.vue'
import commonMixin from '../../../mixins/commonMixin.js'

export default {
  components: {
    Identicon,
    Loading,
  },
  mixins: [commonMixin],
  data() {
    return {
      accountId: this.$route.params.id,
      data: {
        architecture: '',
        automation: '',
        metrics: '',
        monitoring: true,
        monitoringDescription: '',
        keyHandling: '',
        highAvailability: '',
        upgradeProcedure: '',
        providers: ['Azure', 'AWS'],
        RBAC: '',
        stakeAutomation: '',
        DDoSProtection: '',
        communication: '',
        education: '',
        regions: ['Asia', 'Europe', 'North America'],
        supportChannels: '',
        contributions: [
          {
            name: 'Project name',
            url: 'Repository URL',
          },
        ],
      },
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
      return validator
    },
  },
  async created() {
    if (this.$store.state.ranking.list.length === 0) {
      await this.$store.dispatch('ranking/update')
    }
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault()
      alert(JSON.stringify(this.data))
    },
  },
}
</script>
