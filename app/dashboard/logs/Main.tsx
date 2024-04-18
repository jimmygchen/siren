import { FC, useEffect, useState } from 'react'
import DashboardWrapper from '../../../src/components/DashboardWrapper/DashboardWrapper'
import LogControls from '../../../src/components/LogControls/LogControls'
import LogDisplay from '../../../src/components/LogDisplay/LogDisplay'
import { OptionType } from '../../../src/components/SelectDropDown/SelectDropDown'
import useNetworkMonitor from '../../../src/hooks/useNetworkMonitor'
import useSWRPolling from '../../../src/hooks/useSWRPolling'
import { LogType } from '../../../src/types'
import { BeaconNodeSpecResults, SyncData } from '../../../src/types/beacon'
import { Diagnostics } from '../../../src/types/diagnostic'

export interface MainProps {
  initNodeHealth: Diagnostics
  beaconSpec: BeaconNodeSpecResults
  initSyncData: SyncData
}

const Main: FC<MainProps> = ({ initSyncData, beaconSpec, initNodeHealth }) => {
  const { SECONDS_PER_SLOT } = beaconSpec
  const { isValidatorError, isBeaconError } = useNetworkMonitor()
  const networkError = isValidatorError || isBeaconError
  const slotInterval = SECONDS_PER_SLOT * 1000

  const [logType, selectType] = useState(LogType.VALIDATOR)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  const { data: syncData } = useSWRPolling<SyncData>('/api/node-sync', {
    refreshInterval: slotInterval,
    fallbackData: initSyncData,
    networkError,
  })
  const { data: nodeHealth } = useSWRPolling<Diagnostics>('/api/node-health', {
    refreshInterval: 6000,
    fallbackData: initNodeHealth,
    networkError,
  })

  const toggleLogType = (selection: OptionType) => {
    if (selection === logType) return

    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      setTimeout(() => {
        selectType(selection as LogType)
      }, 500)
    }, 500)
  }

  return (
    <DashboardWrapper
      syncData={syncData}
      beaconSpec={beaconSpec}
      isBeaconError={isBeaconError}
      isValidatorError={isValidatorError}
      nodeHealth={nodeHealth}
    >
      <div className='w-full h-full pt-8 p-2 md:p-6 flex flex-col'>
        <LogControls logType={logType} onSetLoading={setLoading} onTypeSelect={toggleLogType} />
        <LogDisplay isLoading={isLoading} type={logType} />
      </div>
    </DashboardWrapper>
  )
}

export default Main
