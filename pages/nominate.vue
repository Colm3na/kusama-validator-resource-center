<template>
  <b-container class="py-5">
    <h1 class="mb-4">Nominate selected</h1>
    <div v-if="loading">
      <Loading />
    </div>
    <div v-else-if="!detectedExtension">
      <b-alert variant="warning" show>
        <i class="fa fa-frown-o"></i>
        <a href="https://github.com/polkadot-js/extension" target="_blank"
          >Polkadot JS extension</a
        >
        not found, please install it and import your account/s before proceed
      </b-alert>
    </div>
    <div v-else-if="noAccountsFound">
      <b-alert variant="warning" show>
        <i class="fa fa-frown-o"></i> No accounts found, open Polkadot JS
        extension and import your account/s before proceed
      </b-alert>
    </div>
    <div v-else-if="onGoingElection">
      <b-alert variant="warning" show>
        <i class="fa fa-frown-o"></i> There is currently an ongoing election for
        new validator candidates. As such staking operations are not permitted
      </b-alert>
    </div>
    <div v-else>
      <b-form class="mt-2" @submit="onSubmit">
        <b-form-group
          id="input-group-from"
          label="Select your controller address:"
          label-for="input-from"
          class="w-100 pt-4"
        >
          <b-dropdown
            block
            menu-class="w-100"
            class="py-2"
            :state="validateState('selectedAddress')"
            aria-describedby="selectedAddress-feedback"
            :text="selectedAddress"
            @change="getAccountInfo(selectedAddress)"
          >
            <b-dropdown-item
              v-for="accountId in extensionAddresses"
              :key="accountId"
              @click="
                selectAddress(accountId)
                getAccountInfo(selectedAddress)
              "
            >
              <div>
                <Identicon :address="accountId" />
                {{ accountId }}
              </div>
            </b-dropdown-item>
          </b-dropdown>
          <div class="controller-address-validation">
            <p
              v-if="tranferableBalance"
              class="ml-2 mb-0 mt-1"
              :class="{
                'text-danger': !(tranferableBalance > 0),
                'text-success': tranferableBalance > 0,
              }"
            >
              Transferable balance:
              {{ formatAmount(tranferableBalance) }}
              <span v-if="tranferableBalance > 0">
                <font-awesome-icon icon="check" />
              </span>
            </p>
            <p
              v-if="addressRole"
              class="ml-2 mb-0 mt-1"
              :class="{
                'text-danger':
                  addressRole !== 'controller' &&
                  addressRole !== 'stash/controller',
                'text-success':
                  addressRole === 'controller' ||
                  addressRole === 'stash/controller',
              }"
            >
              <span v-if="addressRole === 'none'">
                Address is not a controller
              </span>
              <span v-else>
                Address is a
                {{ addressRole }}
              </span>
              <span
                v-if="
                  addressRole === 'controller' ||
                  addressRole === 'stash/controller'
                "
              >
                <font-awesome-icon icon="check" />
              </span>
            </p>
          </div>
          <b-form-invalid-feedback id="selectedAddress-feedback"
            >Please install Polkadot JS extension
          </b-form-invalid-feedback>
          <p class="pt-4">Target validators:</p>
          <div
            v-for="validator in list"
            :key="validator.stashAddress"
            class="row pb-1"
          >
            <div class="col-10">
              <Identicon :address="validator.stashAddress" :size="20" />
              <nuxt-link :to="`/validator/${validator.stashAddress}`">
                <span v-if="validator.name">
                  {{ validator.name }}
                  <VerifiedIcon />
                </span>
                <span v-else>
                  {{ shortAddress(validator.stashAddress) }}
                </span>
              </nuxt-link>
            </div>
            <div class="col-2 text-right">
              <a
                v-b-tooltip.hover
                href="#"
                title="Remove"
                class="remove"
                @click.stop.prevent="remove(validator.stashAddress)"
              >
                <font-awesome-icon icon="times" />
              </a>
            </div>
          </div>
        </b-form-group>
        <b-alert
          v-if="extrinsicHash && extrinsicStatus === 'Finalized'"
          variant="success"
          class="text-center"
          fade
          show
        >
          <h4>{{ extrinsicStatus }} transaction!</h4>
          <p>
            Extrinsic with hash {{ extrinsicHash }} was included in block
            <a
              v-b-tooltip.hover
              :href="`https://kusama.polkastats.io/block/${blockHash}`"
              title="Check block information"
              target="_blank"
            >
              <Promised :promise="getBlockNumber(blockHash)">
                <template #default="data">#{{ formatNumber(data) }}</template>
              </Promised>
            </a>
          </p>
        </b-alert>
        <b-alert
          v-else-if="
            extrinsicHash && extrinsicStatus && extrinsicStatus !== 'Finalized'
          "
          variant="info"
          class="text-center"
          fade
          show
        >
          <h4>Transaction hash {{ extrinsicHash }}</h4>
          <p>Transaction status: {{ extrinsicStatus }}</p>
        </b-alert>
        <b-button
          type="submit"
          variant="outline-primary2"
          class="btn-block mt-3"
          :disabled="
            noAccountsFound ||
            !tranferableBalance > 0 ||
            !(
              addressRole === 'controller' || addressRole === 'stash/controller'
            )
          "
        >
          Nominate
        </b-button>
      </b-form>
    </div>
  </b-container>
</template>

<script>
import { BigNumber } from 'bignumber.js'
import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
} from '@polkadot/extension-dapp'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { encodeAddress } from '@polkadot/keyring'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { Promised } from 'vue-promised'
import Identicon from '@/components/Identicon.vue'
import commonMixin from '@/mixins/commonMixin.js'
import { config } from '@/config.js'

export default {
  components: { Identicon, Promised },
  mixins: [commonMixin, validationMixin],
  data() {
    return {
      config,
      favorites: [],
      detectedExtension: false,
      extensionAccounts: [],
      extensionAddresses: [],
      selectedAccount: null,
      selectedAddress: null,
      tranferableBalance: 0,
      api: null,
      enableWeb3: false,
      error: null,
      amount: 0,
      extrinsicHash: null,
      extrinsicStatus: null,
      blockHash: null,
      success: null,
      noAccountsFound: true,
      addressRole: null,
      onGoingElection: false,
    }
  },
  head() {
    return {
      title: `Nominate | ${this.config.title} for ${this.capitalize(
        this.config.name
      )}`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Nominate selected validators',
        },
      ],
    }
  },
  computed: {
    loading() {
      return this.$store.state.ranking.loading
    },
    list() {
      return this.$store.state.ranking.list.filter(({ stashAddress }) =>
        this.selectedAddresses.includes(stashAddress)
      )
    },
    selectedAddresses() {
      return this.$store.state.ranking.selectedAddresses
    },
  },
  validations: {
    selectedAddress: {
      required,
    },
  },
  async created() {
    if (this.$store.state.ranking.list.length === 0) {
      await this.$store.dispatch('ranking/update')
    }
    this.enableWeb3 = await web3Enable(
      `${config.title} for ${this.capitalize(config.name)}`
    )
      .then(() => {
        web3Accounts()
          .then((accounts) => {
            const wsProvider = new WsProvider(config.nodeWs)
            ApiPromise.create({ provider: wsProvider }).then((api) => {
              this.api = api
              this.getElectionStatus()
              if (accounts.length > 0) {
                this.detectedExtension = true
                this.extensionAccounts = accounts
                accounts.forEach((account) =>
                  this.extensionAddresses.push(
                    encodeAddress(account.address, config.addressPrefix)
                  )
                )
                if (
                  this.extensionAccounts.length > 0 &&
                  this.extensionAddresses.length > 0
                ) {
                  this.selectedAccount = this.extensionAccounts[0]
                  this.selectedAddress = this.extensionAddresses[0]
                  this.getAccountInfo(this.selectedAddress)
                  this.noAccountsFound = false
                } else {
                  this.noAccountsFound = true
                }
              }
            })
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log('Error: ', error)
          })
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.log('Error: ', error)
      })
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v[name]
      return $dirty ? !$error : null
    },
    onSubmit(evt) {
      evt.preventDefault()
      this.$v.$touch()
      if (this.$v.$invalid) {
        return
      }
      this.nominate()
    },
    async getAccountInfo(address) {
      const { availableBalance } = await this.api.derive.balances.all(address)
      this.tranferableBalance = new BigNumber(availableBalance)
      this.addressRole = await this.getAddressRole(address)
    },
    async getAddressRole(address) {
      const bonded = await this.api.query.staking.bonded(address)
      if (bonded.toString() && bonded.toString() === address) {
        return `stash/controller`
      } else if (bonded.toString() && bonded.toString() !== address) {
        return `stash`
      } else {
        const stakingLedger = await this.api.query.staking.ledger(address)
        if (stakingLedger.toString()) {
          return `controller`
        } else {
          return `none`
        }
      }
    },
    async getBlockNumber(hash) {
      const { number } = await this.api.rpc.chain.getHeader(hash)
      return number
    },
    async getElectionStatus() {
      const eraElectionStatus = await this.api.query.staking.eraElectionStatus()
      this.onGoingElection = eraElectionStatus.isOpen
    },
    nominate() {
      this.selectedAccount = encodeAddress(this.selectedAddress, 42)
      web3FromAddress(this.selectedAccount)
        .then(async (injector) => {
          this.api.setSigner(injector.signer)
          const { nonce } = await this.api.query.system.account(
            this.selectedAddress
          )
          await this.api.tx.staking
            .nominate(this.selectedAddresses)
            .signAndSend(
              this.selectedAccount,
              { nonce },
              ({ events = [], status }) => {
                this.extrinsicStatus = status.type
                if (status.isInBlock) {
                  this.extrinsicHash = status.asInBlock.toHex()
                } else if (status.isFinalized) {
                  this.blockHash = status.asFinalized.toHex()
                }
              }
            )
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log('Error: ', error)
        })
    },
    remove(accountId) {
      this.$store.dispatch('ranking/toggleSelected', { accountId })
    },
    selectAddress(accountId) {
      this.selectedAddress = accountId
    },
  },
}
</script>
