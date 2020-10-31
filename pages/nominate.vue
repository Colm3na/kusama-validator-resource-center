<template>
  <b-container class="py-5">
    <div v-if="loading">
      <Loading />
    </div>
    <div v-else>
      <h1 class="mb-4">Nominate selected</h1>
      <b-alert v-if="!detectedExtension" variant="danger" show>
        <i class="fa fa-frown-o"></i>
        Extension not found!
      </b-alert>
      <b-alert v-if="noAccountsFound" variant="danger" show>
        <i class="fa fa-frown-o"></i> No accounts found!
      </b-alert>
      <h5>Your validator set:</h5>
      <hr />
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
      <b-form class="mt-2" @submit="onSubmit">
        <b-form-group
          id="input-group-from"
          label="Select controller address"
          label-for="input-from"
          class="w-100 pt-4"
        >
          <b-form-select
            id="input-from"
            v-model="$v.selectedAddress.$model"
            :options="extensionAddresses"
            :state="validateState('selectedAddress')"
            aria-describedby="selectedAddress-feedback"
            class="w-100"
            @change="getAccountInfo(selectedAddress)"
          ></b-form-select>
          <div>
            <p
              v-if="tranferableBalance"
              class="ml-2 mb-0 mt-1"
              :class="{ 'text-danger': !(tranferableBalance > 0) }"
            >
              Transferable balance:
              {{ formatAmount(tranferableBalance) }}
            </p>
            <p
              v-if="addressRole"
              class="ml-2 mb-0 mt-1"
              :class="{ 'text-danger': !(tranferableBalance > 0) }"
            >
              AddresssRole:
              {{ addressRole }}
            </p>
          </div>
          <b-form-invalid-feedback id="selectedAddress-feedback"
            >Please install Polkadot JS extension
          </b-form-invalid-feedback>
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
                <template v-slot="data">#{{ formatNumber(data) }}</template>
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
          variant="outline-kusama"
          class="btn-block mt-3"
          :disabled="
            noAccountsFound ||
            !this.tranferableBalance > 0 ||
            !(
              this.addressRole === 'controller' ||
              this.addressRole === 'stash/controller'
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
import Identicon from '../components/Identicon.vue'
import commonMixin from '../mixins/commonMixin.js'
import { config } from '../config.js'

export default {
  components: { Identicon, Promised },
  mixins: [commonMixin, validationMixin],
  data() {
    return {
      favorites: [],
      detectedExtension: false,
      extensionAccounts: [],
      extensionAddresses: [],
      selectedAccount: null,
      selectedAddress: null,
      tranferableBalance: 0,
      targetAddress: '',
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
    this.enableWeb3 = await web3Enable(config.name)
    web3Enable(config.name)
      .then(() => {
        web3Accounts()
          .then((accounts) => {
            const wsProvider = new WsProvider(config.nodeWs)
            ApiPromise.create({ provider: wsProvider }).then((api) => {
              this.api = api
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
            console.log('Error: ', error)
          })
      })
      .catch((error) => {
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
                console.log('Transaction status:', status.type)
                if (status.isInBlock) {
                  this.extrinsicHash = status.asInBlock.toHex()
                  console.log(
                    'Included at block hash',
                    status.asInBlock.toHex()
                  )
                  console.log('Events:')
                  events.forEach(
                    ({ event: { data, method, section }, phase }) => {
                      console.log(
                        '\t',
                        phase.toString(),
                        `: ${section}.${method}`,
                        data.toString()
                      )
                    }
                  )
                } else if (status.isFinalized) {
                  this.blockHash = status.asFinalized.toHex()
                  console.log(
                    'Finalized block hash',
                    status.asFinalized.toHex()
                  )
                }
              }
            )
        })
        .catch((error) => {
          console.log('Error: ', error)
        })
    },
    remove(accountId) {
      this.$store.dispatch('ranking/toggleSelected', { accountId })
    },
  },
  head() {
    return {
      title: `Nominate | Validator Resource Center and Ranking Website for Kusama`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Nominate selected validators',
        },
      ],
    }
  },
}
</script>

<style></style>
