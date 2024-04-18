import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { BeaconSyncInfo } from '../../types/diagnostic'
import SyncMetric from '../SyncMetric/SyncMetric'

export interface BeaconMetricProps {
  data: BeaconSyncInfo
}

const BeaconMetric: FC<BeaconMetricProps> = ({ data }) => {
  const { t } = useTranslation()
  const { headSlot, slotDistance, isSyncing, beaconPercentage } = data

  return (
    <SyncMetric
      id='beaconChain'
      borderStyle='border-r'
      title='BEACON CHAIN'
      className='md:ml-4'
      subTitle={`${isSyncing ? t('syncing') : slotDistance ? t('synced') : ''} —`}
      percent={beaconPercentage}
      amount={headSlot}
      total={slotDistance}
      direction='counter'
    />
  )
}

export default BeaconMetric
