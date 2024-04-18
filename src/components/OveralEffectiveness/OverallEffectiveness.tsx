import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import formatValidatorEffectiveness from '../../../utilities/formatValidatorEffectiveness'
import getAvgEffectivenessStatus from '../../../utilities/getAvgEffectivenessStatus'
import toFixedIfNecessary from '../../../utilities/toFixedIfNecessary'
import { BeaconValidatorMetricResults } from '../../types/beacon'
import EffectivenessBreakdown from '../EffectivenessBreakdown/EffectivenessBreakdown'
import Status from '../Status/Status'
import Typography from '../Typography/Typography'

export interface OverallEffectivenessProps {
  validatorMetrics?: BeaconValidatorMetricResults[] | undefined
}

const OverallEffectiveness: FC<OverallEffectivenessProps> = ({ validatorMetrics }) => {
  const { t } = useTranslation()
  const { avgTargetEffectiveness, avgHitEffectiveness } =
    formatValidatorEffectiveness(validatorMetrics)

  const combinedEffectiveness =
    avgTargetEffectiveness &&
    avgHitEffectiveness &&
    (avgTargetEffectiveness + avgHitEffectiveness) / 2

  const status = getAvgEffectivenessStatus(combinedEffectiveness)

  return (
    <div className='p-3 group space-y-2 relative cursor-help'>
      <Typography type='text-caption2' isBold isUpperCase>
        {t('validatorManagement.summary.avgEffectiveness')}
      </Typography>
      <div className='flex justify-between lg:justify-start lg:space-x-8'>
        <Status status={status} />
        <Typography isBold type='text-caption1'>
          {combinedEffectiveness ? `${toFixedIfNecessary(combinedEffectiveness, 2)} %` : '----'}
        </Typography>
      </div>
      <EffectivenessBreakdown
        className='group-hover:block @1540:w-80'
        target={avgTargetEffectiveness}
        head={avgHitEffectiveness}
        targetDescription={t('validatorManagement.effectiveness.overallTargetDescription')}
        headDescription={t('validatorManagement.effectiveness.overallHeadHitDescription')}
      />
    </div>
  )
}

export default OverallEffectiveness
