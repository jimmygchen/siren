import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { formatLocalCurrency } from '../../../utilities/formatLocalCurrency'
import { ValidatorCountResult } from '../../types/validator'
import Typography from '../Typography/Typography'

export interface ActiveValidatorCountProps {
  validatorNetworkData: ValidatorCountResult
}

const ActiveValidatorCount: FC<ActiveValidatorCountProps> = ({ validatorNetworkData }) => {
  const { t } = useTranslation()

  const { active_ongoing } = validatorNetworkData

  return (
    <div className='flex justify-between lg:justify-start lg:space-x-2'>
      <Typography color='text-dark300' isCapitalize type='text-caption1'>
        {t('validatorManagement.summary.active')}
      </Typography>
      <Typography isBold type='text-caption1'>
        {formatLocalCurrency(active_ongoing, { isStrict: true })}
      </Typography>
    </div>
  )
}

export default ActiveValidatorCount
