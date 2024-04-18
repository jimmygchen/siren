import Image from 'next/image';
import { FC } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { useRecoilValue } from 'recoil'
import Waves from '../../assets/images/waves.png'
import { selectBeaconChaBaseUrl } from '../../recoil/selectors/selectBeaconChaBaseUrl'
import { ValidatorInfo } from '../../types/validator'
import IdenticonIcon from '../IdenticonIcon/IdenticonIcon'
import Typography from '../Typography/Typography'

export interface ValidatorInfoHeaderProps {
  validator: ValidatorInfo
}

const ValidatorInfoHeader: FC<ValidatorInfoHeaderProps> = ({ validator }) => {
  const { t } = useTranslation()
  const { pubKey, name, index, balance } = validator
  const baseUrl = useRecoilValue(selectBeaconChaBaseUrl)

  return (
    <div className='w-full relative'>
      <div className='absolute overflow-hidden z-10 top-0 left-0 w-full h-full'>
        <Image className='z-10 absolute w-full left-0 top-0 opacity-10' alt="waves" src={Waves} />
        <div className='absolute top-0 z-20 right-0 w-3/4 h-full bg-gradient-to-l from-white dark:from-dark750 via-white dark:via-dark750 to-transparent' />
      </div>
      <div className='w-full z-20 flex relative p-6'>
        <div className='w-42 mr-2'>
          <IdenticonIcon size={144} type='CIRCULAR' hash={pubKey} />
        </div>
        <div className='flex-1 flex justify-between'>
          <div>
            <Typography className='text-left'>{name}</Typography>
            <a target='_blank' rel='noreferrer' href={`${baseUrl}/${index}`}>
              <Typography
                type='text-caption1'
                className='underline'
                color='text-primary'
                darkMode='dark:text-primary'
              >
                {t('validatorInfoHeader.viewOnBeaconChain')}
              </Typography>
            </a>
          </div>
          <div className='text-right flex flex-col justify-between'>
            <div>
              <Typography isBold type='text-caption1'>
                {pubKey.substring(0, 12)}
              </Typography>
              <Typography type='text-caption1'>{index}</Typography>
            </div>
            <div>
              <Typography>-</Typography>
              <Typography isUpperCase isBold type='text-tiny'>
                <Trans i18nKey='validatorInfoHeader.validatorBalance'>
                  <br />
                </Trans>
              </Typography>
              <Typography>{balance.toFixed(2)} ETH</Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ValidatorInfoHeader
