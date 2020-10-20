import { formatBalance, isHex } from '@polkadot/util'
formatBalance.setDefaults({
  decimals: 12,
  unit: 'KSM',
})

export default {
  methods: {
    shortAddress(address) {
      return (
        address.substring(0, 5) + '…' + address.substring(address.length - 5)
      )
    },
    formatNumber(number) {
      if (isHex(number)) {
        return parseInt(number, 16)
          .toString()
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      } else {
        return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      }
    },
    formatAmount(amount) {
      return formatBalance(amount.toString(10))
    },
  },
}
