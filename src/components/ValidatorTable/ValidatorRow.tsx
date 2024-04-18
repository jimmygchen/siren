import Link from 'next/link'
import { FC, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'
import formatBalanceColor from '../../../utilities/formatBalanceColor'
import formatEthAddress from '../../../utilities/formatEthAddress'
import formatValidatorEpochData from '../../../utilities/formatValidatorEpochData'
import isBlsAddress from '../../../utilities/isBlsAddress'
import ValidatorLogo from '../../assets/images/validators.svg'
import useLocalStorage from '../../hooks/useLocalStorage'
import { processingBlsValidators } from '../../recoil/atoms'
import { selectBeaconChaBaseUrl } from '../../recoil/selectors/selectBeaconChaBaseUrl'
import { ValAliases } from '../../types'
import { ValidatorBalanceInfo, ValidatorCache, ValidatorInfo } from '../../types/validator'
import DisabledTooltip from '../DisabledTooltip/DisabledTooltip'
import EditValidator from '../EditValidator/EditValidator'
import IdenticonIcon from '../IdenticonIcon/IdenticonIcon'
import StatusIcon from '../StatusIcon/StatusIcon'
import Tooltip from '../ToolTip/Tooltip'
import Typography from '../Typography/Typography'
import ValidatorActionIcon from '../ValidatorActionIcon/ValidatorActionIcon'
import { TableView } from './ValidatorTable'

export interface ValidatorRowProps {
  validator: ValidatorInfo
  view?: TableView | undefined
  validatorCacheData?: ValidatorCache | undefined
}

const ValidatorRow: FC<ValidatorRowProps> = ({ validator, view, validatorCacheData }) => {
  const { t } = useTranslation()
  const [isReady, setReady] = useState(false)
  const processingValidators = useRecoilValue(processingBlsValidators)
  const { name, pubKey, index, balance, rewards, status, withdrawalAddress } = validator
  const rewardColor = formatBalanceColor(rewards)
  const baseUrl = useRecoilValue(selectBeaconChaBaseUrl)
  const valHref = `/dashboard/validators?id=${index}`
  const [aliases] = useLocalStorage<ValAliases>('val-aliases', {})

  const storedAliasIndex = Object.keys(aliases).find((index) => Number(index) === validator.index)
  const validatorName = storedAliasIndex && isReady ? aliases[storedAliasIndex] : name

  useEffect(() => {
    setReady(true)
  }, [])

  const isConversionRequired = isBlsAddress(withdrawalAddress)
  const isValidatorProcessing =
    processingValidators && processingValidators.includes(validator.index.toString())

  const validatorEpochData = useMemo<ValidatorBalanceInfo | undefined>(() => {
    if (!validatorCacheData) return
    return formatValidatorEpochData([validator], validatorCacheData)
  }, [validator, validatorCacheData])

  const renderAvatar = () => {
    if (isConversionRequired) {
      return (
        <Tooltip id={`blsTransfer-${pubKey}`} maxWidth={300} text={t('blsExecution.tooltip')}>
          <div className='relative'>
            <IdenticonIcon size={32} type='CIRCULAR' hash={pubKey} />
            {isConversionRequired && !isValidatorProcessing && (
              <i className='bi-exclamation text-3xl text-error absolute z-10 -top-2.5 -right-3.5' />
            )}
          </div>
        </Tooltip>
      )
    }

    return <IdenticonIcon size={32} type='CIRCULAR' hash={pubKey} />
  }

  return (
    <tr className='w-full border-t-style500 h-12'>
      <th className='px-2 cursor-pointer'>
        <Link href={valHref}>
          <div className='w-full flex justify-center'>{renderAvatar()}</div>
        </Link>
      </th>
      <th className='w-28 cursor-pointer'>
        <Link href={valHref}>
          <Typography className='text-left' color='text-dark500' type='text-caption2'>
            {validatorName}
          </Typography>
        </Link>
      </th>
      <th className='border-r-style500 px-2'>
        <Typography color='text-dark500' type='text-caption1'>
          {index}
        </Typography>
      </th>
      <th className='px-2'>
        <Typography color='text-dark500' type='text-caption1' className='text-left'>
          {formatEthAddress(pubKey)}
        </Typography>
      </th>
      <th className='px-2'>
        <Typography type='text-caption1' className='text-left' darkMode='dark:text-white' isBold>
          {balance.toFixed(4)}
        </Typography>
      </th>
      <th className='px-2'>
        <Typography
          color={rewardColor}
          darkMode={rewardColor}
          type='text-caption1'
          className='uppercase'
        >
          {rewards.toFixed(4)}
        </Typography>
      </th>
      <th className='px-1 opacity-20'>
        <Typography color='text-dark500' type='text-caption1' className='whitespace-nowrap'>
          {/* {processed} / {missed} */}-
        </Typography>
      </th>
      <th className='px-1 opacity-20'>
        <Typography color='text-dark500' type='text-caption1'>
          {/* {attested} */}-
        </Typography>
      </th>
      <th className='px-1 opacity-20'>
        <Typography color='text-dark500' type='text-caption1'>
          {/* {aggregated} */}-
        </Typography>
      </th>
      <th className='border-r-style500 px-4'>
        <div className='flex items-center justify-between flex-wrap w-full max-w-tiny'>
          <Typography color='text-dark500' type='text-tiny' className='uppercase'>
            {t(`validatorStatus.${status}`)}
          </Typography>
          <StatusIcon status={status} />
        </div>
      </th>
      {view === 'full' && (
        <>
          <th className='px-2'>
            <DisabledTooltip>
              <div className='w-full flex justify-center'>
                <ValidatorActionIcon
                  size='text-xs'
                  border='border border-error'
                  icon='bi-x-lg'
                  color='text-error'
                />
              </div>
            </DisabledTooltip>
          </th>
          <th className='px-2'>
            <DisabledTooltip>
              <div className='w-full flex justify-center'>
                <ValidatorActionIcon
                  border='border border-primary100 dark:border-primary'
                  icon='bi-arrow-down-circle'
                />
              </div>
            </DisabledTooltip>
          </th>
          <th className='px-2'>
            <DisabledTooltip>
              <div className='w-full flex justify-center'>
                <ValidatorActionIcon
                  border='border border-dark700'
                  color='text-dark700 dark:text-dark400'
                  icon='bi-box-arrow-right'
                />
              </div>
            </DisabledTooltip>
          </th>
          <th className='px-2'>
            <DisabledTooltip>
              <div className='w-full flex justify-center'>
                <ValidatorActionIcon
                  border='border border-primary100 dark:border-primary'
                  icon='bi-key-fill'
                />
              </div>
            </DisabledTooltip>
          </th>
          <th className='px-2'>
            <div className='w-full flex justify-center'>
              <EditValidator validatorEpochData={validatorEpochData} validator={validator} />
            </div>
          </th>
        </>
      )}
      <th className='border-r-style500 px-2'>
        <div className='w-full flex justify-center'>
          <a target='_blank' rel='noreferrer' href={`${baseUrl}/${index}`}>
            <ValidatorActionIcon icon='bi-box-arrow-in-up-right' />
          </a>
        </div>
      </th>
      <th className='px-2'>
        <div className='w-full flex justify-center'>
          <Link href={valHref}>
            <div className='cursor-pointer w-8 h-8 border border-primary100 dark:border-primary bg-dark25 dark:bg-dark750 rounded-full flex items-center justify-center'>
              <div className='w-4 h-4'>
                <ValidatorLogo className='text-primary' />
              </div>
            </div>
          </Link>
        </div>
      </th>
    </tr>
  )
}

export default ValidatorRow
