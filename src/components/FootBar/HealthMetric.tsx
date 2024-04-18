import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Diagnostics } from '../../types/diagnostic'
import DiagnosticCard from '../DiagnosticCard/DiagnosticCard'
import Spinner from '../Spinner/Spinner'

export const HealthMetricFallback = () => (
  <div className='border border-dark200 flex items-center justify-center w-40 h-11 p-1 dark:border-none px-1.5'>
    <Spinner size='h-4 w-4' />
  </div>
)

export interface HealthMetricProps {
  isSyncing: boolean
  nodeHealth: Diagnostics
}

const HealthMetric: FC<HealthMetricProps> = ({ nodeHealth, isSyncing }) => {
  const { t } = useTranslation()
  const {
    healthCondition,
    overallHealthStatus,
    uptime: { beacon },
  } = nodeHealth
  const condition = isSyncing ? healthCondition.syncing : healthCondition.synced
  const healthStatus = isSyncing ? overallHealthStatus.syncing : overallHealthStatus.synced

  return (
    <DiagnosticCard
      border='border-x border-dark200'
      title={t('healthCheck')}
      metric={`${t('uptime')} ${beacon}`}
      status={healthStatus}
      subTitle={`${t(condition.toLowerCase()).toUpperCase()}, ${t('nodes')} ${
        isSyncing ? t('syncing') : t('synced')
      }...`}
      maxWidth='w-fit'
      size='sm'
    />
  )
}

export default HealthMetric
