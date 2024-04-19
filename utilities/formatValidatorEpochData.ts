import {
  FormattedValidatorCache,
  ValidatorBalanceInfo,
  ValidatorCache,
  ValidatorEpochResult,
  ValidatorInfo,
} from '../src/types/validator'

const formatValidatorEpochData = (
  validators: ValidatorInfo[],
  validatorCacheData: ValidatorCache,
): ValidatorBalanceInfo => ({
  validators,
  balances: Object.entries(validatorCacheData)
    .filter(([key, value]: [string, ValidatorEpochResult[]]) =>
      validators.some((validator) => parseInt(key, 10) === validator.index),
    )
    .flatMap(([, value]) => value)
    .reduce((acc: any, { epoch, total_balance }) => {
      acc[epoch] = acc[epoch] || []
      acc[epoch].push(total_balance)
      return acc
    }, {}) as FormattedValidatorCache[],
})

export default formatValidatorEpochData
