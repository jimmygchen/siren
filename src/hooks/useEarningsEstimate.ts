import { useState } from 'react'
import { ValidatorBalanceInfo } from '../types/validator'
import useValidatorEarnings from './useValidatorEarnings'

const useEarningsEstimate = (validatorData: ValidatorBalanceInfo) => {
  const [estimateSelection, setEstimate] = useState<number | undefined>(undefined)
  const {
    annualizedEarningsPercent,
    totalEarnings,
    hourlyEstimate,
    dailyEstimate,
    weeklyEstimate,
    monthlyEstimate,
  } = useValidatorEarnings(validatorData)

  const currentEstimate = () => {
    switch (estimateSelection) {
      case 0:
        return hourlyEstimate
      case 1:
        return dailyEstimate
      case 2:
        return weeklyEstimate
      case 3:
        return monthlyEstimate
      default:
        return totalEarnings
    }
  }
  const selectEstimate = (selection?: number) => setEstimate(selection)

  return {
    totalEarnings,
    estimateSelection,
    annualizedEarningsPercent,
    estimate: currentEstimate(),
    selectEstimate,
  }
}

export default useEarningsEstimate
