import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { formatLocalCurrency } from '../../../utilities/formatLocalCurrency'
import secondsToShortHand from '../../../utilities/secondsToShortHand'
import { BeaconSyncInfo } from '../../types/diagnostic'
import SyncCard from '../SyncCard/SyncCard'

export interface BeaconSyncCardProps {
  data: BeaconSyncInfo
}

const BeaconSyncCard: FC<BeaconSyncCardProps> = ({ data }) => {
  const { t } = useTranslation()
  const { headSlot, slotDistance, beaconPercentage, beaconSyncTime } = data
  const remainingBeaconTime = secondsToShortHand(beaconSyncTime || 0)

  return (
    <SyncCard
      type='beacon'
      title='Ethereum Beacon'
      subTitle='Lighthouse Node'
      timeRemaining={beaconSyncTime ? remainingBeaconTime : t('synced')}
      status={`${formatLocalCurrency(headSlot, { isStrict: true })} / ${formatLocalCurrency(slotDistance, { isStrict: true })}`}
      progress={beaconPercentage}
    />
  )
}

export default BeaconSyncCard
