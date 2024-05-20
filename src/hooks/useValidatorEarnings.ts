import { useEffect, useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'
import calculateAprPercentage from '../../utilities/calculateAprPercentage'
import calculateEpochEstimate from '../../utilities/calculateEpochEstimate'
import {
  initialEthDeposit,
  secondsInDay,
  secondsInHour,
  secondsInWeek,
} from '../constants/constants'
import { beaconNodeSpec } from '../recoil/atoms'
import { FormattedValidatorCache, ValidatorBalanceInfo } from '../types/validator'

const useValidatorEarnings = (validatorData: ValidatorBalanceInfo) => {
  const spec = useRecoilValue(beaconNodeSpec)
  const interval = spec?.SECONDS_PER_SLOT || 12
  const { validators, balances } = validatorData || {}

  const epochKeys = balances ? Object.keys(balances) : undefined
  const lastEpoch = epochKeys ? epochKeys[epochKeys.length - 1] : undefined

  const [epochCaches, setCaches] = useState<FormattedValidatorCache | undefined>()

  useEffect(() => {
    setCaches((prev) => Object.assign({} as FormattedValidatorCache, prev, balances))
  }, [lastEpoch, balances])

  const total = useMemo(() => {
    return validators?.map((validator) => validator.balance).reduce((a, b) => a + b, 0)
  }, [validators])

  const totalEarnings = useMemo(() => {
    return validators?.map((validator) => validator.rewards).reduce((a, b) => a + b, 0)
  }, [validators])

  const hourlyEstimate = useMemo(
    () => calculateEpochEstimate(secondsInHour, interval, epochCaches),
    [epochCaches, interval],
  )

  const dailyEstimate = useMemo(
    () => calculateEpochEstimate(secondsInDay, interval, epochCaches),
    [epochCaches, interval],
  )

  const weeklyEstimate = useMemo(
    () => calculateEpochEstimate(secondsInWeek, interval, epochCaches),
    [epochCaches, interval],
  )

  const monthlyEstimate = useMemo(
    () => calculateEpochEstimate(secondsInWeek * 4, interval, epochCaches),
    [epochCaches, interval],
  )

  const initialEth = (validators?.length || 0) * initialEthDeposit
  const annualizedEarningsPercent = calculateAprPercentage(total, initialEth)

  return {
    total,
    totalEarnings,
    annualizedEarningsPercent,
    hourlyEstimate,
    dailyEstimate,
    weeklyEstimate,
    monthlyEstimate,
  }
}

export default useValidatorEarnings
