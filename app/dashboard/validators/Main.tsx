'use client'

import moment from 'moment'
import { useSearchParams } from 'next/navigation'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSetRecoilState } from 'recoil'
import Button, { ButtonFace } from '../../../src/components/Button/Button'
import DashboardWrapper from '../../../src/components/DashboardWrapper/DashboardWrapper'
import DisabledTooltip from '../../../src/components/DisabledTooltip/DisabledTooltip'
import Typography from '../../../src/components/Typography/Typography'
import ValidatorModal from '../../../src/components/ValidatorModal/ValidatorModal'
import ValidatorSearchInput from '../../../src/components/ValidatorSearchInput/ValidatorSearchInput'
import ValidatorSummary from '../../../src/components/ValidatorSummary/ValidatorSummary'
import ValidatorTable from '../../../src/components/ValidatorTable/ValidatorTable'
import { CoinbaseExchangeRateUrl } from '../../../src/constants/constants'
import useNetworkMonitor from '../../../src/hooks/useNetworkMonitor'
import useSWRPolling from '../../../src/hooks/useSWRPolling'
import { exchangeRates } from '../../../src/recoil/atoms'
import {
  BeaconNodeSpecResults,
  BeaconValidatorMetricResults,
  SyncData,
} from '../../../src/types/beacon'
import { Diagnostics } from '../../../src/types/diagnostic'
import { ValidatorCache, ValidatorCountResult, ValidatorInfo } from '../../../src/types/validator'

export interface MainProps {
  initNodeHealth: Diagnostics
  initValStates: ValidatorInfo[]
  initValidatorCountData: ValidatorCountResult
  initSyncData: SyncData
  initValCaches: ValidatorCache
  initValMetrics: BeaconValidatorMetricResults
  beaconSpec: BeaconNodeSpecResults
}

const Main: FC<MainProps> = (props) => {
  const { t } = useTranslation()
  const {
    initNodeHealth,
    initSyncData,
    beaconSpec,
    initValMetrics,
    initValidatorCountData,
    initValStates,
    initValCaches,
  } = props

  const { SECONDS_PER_SLOT } = beaconSpec
  const setExchangeRate = useSetRecoilState(exchangeRates)
  const [timedMetrics, storeMetric] = useState<BeaconValidatorMetricResults[]>([])
  const [search, setSearch] = useState('')

  const { isValidatorError, isBeaconError } = useNetworkMonitor()

  const networkError = isValidatorError || isBeaconError

  const slotInterval = SECONDS_PER_SLOT * 1000
  const searchParams = useSearchParams()
  const validatorId = searchParams.get('id')
  const { data: exchangeData } = useSWRPolling(CoinbaseExchangeRateUrl, {
    refreshInterval: 60 * 1000,
    networkError,
  })

  const { data: valNetworkData } = useSWRPolling<ValidatorCountResult>('/api/validator-network', {
    refreshInterval: 60 * 1000,
    fallbackData: initValidatorCountData,
    networkError,
  })
  const { data: validatorCache } = useSWRPolling<ValidatorCache>('/api/validator-cache', {
    refreshInterval: slotInterval / 2,
    fallbackData: initValCaches,
    networkError,
  })
  const { data: validatorStates } = useSWRPolling<ValidatorInfo[]>(`/api/validator-states`, {
    refreshInterval: slotInterval,
    fallbackData: initValStates,
    networkError,
  })
  const { data: nodeHealth } = useSWRPolling<Diagnostics>('/api/node-health', {
    refreshInterval: 6000,
    fallbackData: initNodeHealth,
    networkError,
  })
  const { data: syncData } = useSWRPolling<SyncData>('/api/node-sync', {
    refreshInterval: slotInterval,
    fallbackData: initSyncData,
    networkError,
  })

  const { data: validatorMetrics } = useSWRPolling<BeaconValidatorMetricResults>(
    '/api/validator-metrics',
    { refreshInterval: slotInterval, fallbackData: initValMetrics, networkError },
  )

  const filteredValidators = useMemo(() => {
    return validatorStates.filter((validator) => {
      const query = search.toLowerCase()

      return (
        validator.name.toLowerCase().includes(query) ||
        (query.length > 3 && validator.pubKey.toLowerCase().includes(query)) ||
        validator.index.toString().includes(query)
      )
    })
  }, [search, validatorStates])

  const rates = exchangeData?.data.rates

  const activeValidator = useMemo(() => {
    if (!validatorId) return

    return validatorStates.find(({ index }) => Number(validatorId) === index)
  }, [validatorId, validatorStates])

  useEffect(() => {
    const MAX_LENGTH = 10

    if (validatorMetrics) {
      storeMetric((prevState: any) => {
        const newTimestamp = moment().unix().toString()
        const updatedState = { ...prevState, [newTimestamp]: validatorMetrics }
        const entries = Object.entries(updatedState)

        if (entries.length > MAX_LENGTH) {
          const excessEntries = entries.length - MAX_LENGTH
          return Object.fromEntries(entries.slice(excessEntries))
        }

        return updatedState
      })
    }
  }, [validatorMetrics, storeMetric])

  useEffect(() => {
    if (rates) {
      setExchangeRate({
        rates,
        currencies: Object.keys(rates),
      })
    }
  }, [rates, setExchangeRate])

  return (
    <DashboardWrapper
      syncData={syncData}
      beaconSpec={beaconSpec}
      isBeaconError={isBeaconError}
      isValidatorError={isValidatorError}
      nodeHealth={nodeHealth}
    >
      <>
        {/* <BlsExecutionModal /> */}
        <div className='w-full grid grid-cols-1 lg:block pb-12 p-4 mb-28 lg:mb-0'>
          <div className='w-full space-y-6 mb-6'>
            <div className='w-full flex flex-col items-center lg:flex-row space-y-8 lg:space-y-0 justify-between'>
              <Typography fontWeight='font-light' type='text-subtitle1' className='capitalize'>
                {t('validatorManagement.title')}
              </Typography>
              <ValidatorSummary
                validators={validatorStates}
                validatorMetrics={timedMetrics}
                validatorNetworkData={valNetworkData}
                validatorCacheData={validatorCache}
              />
            </div>
            <div className='flex flex-col lg:flex-row justify-between lg:items-center'>
              <Typography
                type='text-subtitle2'
                color='text-transparent'
                darkMode='text-transparent'
                className='primary-gradient-text capitalize'
                fontWeight='font-light'
              >
                {t('validatorManagement.overview')}
              </Typography>
              <div className='flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-4'>
                <ValidatorSearchInput onChange={setSearch} value={search} />
                <div className='flex justify-center lg:justify-start space-x-4'>
                  <DisabledTooltip>
                    <Button type={ButtonFace.SECONDARY}>
                      {t('validatorManagement.actions.deposit')}{' '}
                      <i className='bi-arrow-down-circle ml-3' />
                    </Button>
                  </DisabledTooltip>
                  <DisabledTooltip>
                    <Button type={ButtonFace.SECONDARY}>
                      {t('validatorManagement.actions.add')}{' '}
                      <i className='bi-plus-circle-fill ml-3' />
                    </Button>
                  </DisabledTooltip>
                </div>
              </div>
            </div>
          </div>
          <ValidatorTable
            validatorCacheData={validatorCache}
            validators={filteredValidators}
            view='full'
          />
          {activeValidator && (
            <ValidatorModal
              validator={activeValidator}
              validatorCacheData={validatorCache}
              validatorMetrics={timedMetrics}
            />
          )}
        </div>
      </>
    </DashboardWrapper>
  )
}

export default Main
