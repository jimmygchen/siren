import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ValidatorSyncInfo } from '../../types/diagnostic'
import SyncMetric from '../SyncMetric/SyncMetric'

export interface ValidatorMetricProps {
  data: ValidatorSyncInfo
}

const ValidatorMetric: FC<ValidatorMetricProps> = ({ data }) => {
  const { t } = useTranslation()
  const { headSlot, cachedHeadSlot, syncPercentage, isReady } = data

  return (
    <SyncMetric
      id='ethMain'
      borderStyle='border-r'
      title={t('executionEngine')}
      subTitle={`${isReady ? t('synced') : t('syncing')} —`}
      percent={syncPercentage}
      amount={cachedHeadSlot}
      color='secondary'
      total={headSlot}
    />
  )
}

export default ValidatorMetric
