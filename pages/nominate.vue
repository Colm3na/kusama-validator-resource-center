<template>
  <b-container class="py-5">
    <b-row>
      <b-col md="12">
        <h1 class="mb-4">Nominate selected validators</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="6 mb-4">
        <b-alert v-if="!detectedExtension" variant="danger" show>
          <i class="fa fa-frown-o"></i>
          Extension not found!
        </b-alert>
        <b-alert v-if="noAccountsFound" variant="danger" show>
          <i class="fa fa-frown-o"></i> No accounts found!
        </b-alert>
        <b-form class="mt-2" @submit="onSubmit">
          <b-form-group
            id="input-group-from"
            label="From"
            label-for="input-from"
            class="w-100"
          >
            <b-form-select
              id="input-from"
              v-model="$v.selectedAddress.$model"
              :options="extensionAddresses"
              :state="validateState('selectedAddress')"
              aria-describedby="selectedAddress-feedback"
              class="w-100"
              @change="getBalance(selectedAddress)"
            ></b-form-select>
            <div>
              <p
                class="ml-2 mb-0 mt-1"
                :class="{ 'text-danger': !(tranferableBalance > 0) }"
              >
                Transferable balance:
                <!-- {{ tranferableBalance }} -->
                {{ formatAmount(tranferableBalance) }}
              </p>
            </div>
            <b-form-invalid-feedback id="selectedAddress-feedback"
              >Please install Polkadot JS extension
            </b-form-invalid-feedback>
          </b-form-group>
          <b-button
            type="submit"
            variant="primary"
            class="btn-send btn-block mt-3"
            :disabled="noAccountsFound"
          >
            <i class="fas fa-paper-plane mr-2"></i> Nominate
          </b-button>
        </b-form>
      </b-col>
      <b-col md="1"></b-col>
      <b-col md="5">
        <b-card>
          <h2>Nominate selected</h2>
          <p>
            <a href="https://github.com/polkadot-js/extension" target="_blank"
              >Polkadot JS extension</a
            >
          </p>
        </b-card>
      </b-col>
    </b-row>
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
import { required, integer } from 'vuelidate/lib/validators'
import Identicon from '../components/Identicon.vue'
import commonMixin from '../mixins/commonMixin.js'
import { config } from '../config.js'

const isValidAddress = (address) => {
  const polkadotRegexp = /^(([0-9a-zA-Z]{47})|([0-9a-zA-Z]{48}))$/
  return polkadotRegexp.test(address)
}

const isValidAmount = (amount, vm) =>
  amount > 0 && vm.getAmount() <= parseInt(vm.tranferableBalance.toString())

export default {
  components: { Identicon },
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
      extrinsic: null,
      success: null,
      noAccountsFound: false,
    }
  },
  validations: {
    selectedAddress: {
      required,
    },
    amount: {
      required,
      integer,
      minValue: 1,
      isValidAmount,
    },
    targetAddress: {
      required,
      isValidAddress,
    },
  },
  async created() {
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
                console.log(accounts)
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
                  this.getBalance(this.selectedAddress)
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
      this.send()
    },
    setUnit(unit) {
      this.selectedUnit = unit
    },
    async getBalance(address) {
      const { availableBalance } = await this.api.derive.balances.all(address)
      console.log(`address ${address}: ${availableBalance}`)
      if (availableBalance) {
        this.tranferableBalance = new BigNumber(availableBalance)
      }
    },
    send() {
      this.selectedAccount = encodeAddress(this.selectedAddress, 42)
      web3FromAddress(this.selectedAccount)
        .then(async (injector) => {
          this.api.setSigner(injector.signer)
          const amount = this.getAmount()
          const extrinsic = await this.api.tx.balances.transfer(
            this.targetAddress,
            amount
          )
          this.extrinsicHash = await extrinsic.signAndSend(this.selectedAccount)
        })
        .catch((error) => {
          console.log('Error: ', error)
        })
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
