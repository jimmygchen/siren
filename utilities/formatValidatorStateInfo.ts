import { BeaconValidatorResult } from '../src/types/validator'
import formatDefaultValName from './formatDefaultValName'
import { formatUnits } from 'ethers/lib/utils'
import { initialEthDeposit } from '../src/constants/constants'
import { ValAliases } from '../src/types'

const formatValidatorStateInfo = (validators?: BeaconValidatorResult[], aliases?: ValAliases) => {
  if (!validators) return

  const validatorInfo = [...validators].sort(
    (a: BeaconValidatorResult, b: BeaconValidatorResult) => Number(a.index) - Number(b.index),
  )

  return validatorInfo.map(({ validator, index, status, balance }: BeaconValidatorResult) => {
    return {
      name: formatDefaultValName(index),
      pubKey: validator.pubkey,
      balance: Number(formatUnits(balance, 'gwei')),
      rewards: Number(formatUnits(balance, 'gwei')) - initialEthDeposit,
      index: Number(index),
      slashed: validator.slashed,
      withdrawalAddress: validator.withdrawal_credentials,
      status: status,
      processed: 0,
      missed: 0,
      attested: 0,
      aggregated: 0,
    }
  })
}

export default formatValidatorStateInfo
