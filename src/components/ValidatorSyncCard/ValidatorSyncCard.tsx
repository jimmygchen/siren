import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { formatLocalCurrency } from '../../../utilities/formatLocalCurrency'
import { ValidatorSyncInfo } from '../../types/diagnostic'
import SyncCard from '../SyncCard/SyncCard'

export interface ValidatorSyncCardProps {
  data: ValidatorSyncInfo
}

const ValidatorSyncCard: FC<ValidatorSyncCardProps> = ({ data }) => {
  const { t } = useTranslation()

  const { syncPercentage, headSlot, cachedHeadSlot } = data

  return (
    <SyncCard
      title='Ethereum Mainnet'
      subTitle='Execution Node'
      type='geth'
      timeRemaining=' '
      status={
        cachedHeadSlot
          ? `${formatLocalCurrency(cachedHeadSlot, { isStrict: true })} / ${formatLocalCurrency(
              headSlot,
              { isStrict: true },
            )}`
          : t('noConnection')
      }
      progress={syncPercentage}
    />
  )
}

export default ValidatorSyncCard
