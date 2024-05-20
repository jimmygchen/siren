import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Button, { ButtonFace } from '../Button/Button'
import Typography from '../Typography/Typography'

export interface ViewDisclosuresProps {
  onClick?: () => void
  onAccept?: () => void
  ctaText?: string
  isDisabled?: boolean
  ctaType?: ButtonFace
  isLoading?: boolean
}

const ViewDisclosures: FC<ViewDisclosuresProps> = ({
  onClick,
  onAccept,
  ctaText,
  ctaType,
  isDisabled,
  isLoading,
}) => {
  const { t } = useTranslation()

  const renderCta = () => {
    if (!onAccept || !ctaText) return null

    return (
      <Button isLoading={isLoading} isDisabled={isDisabled} type={ctaType} onClick={onAccept}>
        {ctaText}
      </Button>
    )
  }

  return (
    <div className='flex space-x-4 items-center justify-between'>
      <div onClick={onClick} className='flex space-x-4 items-center cursor-pointer'>
        <i className='bi-info-circle text-caption1 text-primary' />
        <Typography
          isBold
          family='font-archivo'
          color='text-primary'
          type='text-caption1'
          isUpperCase
        >
          {t('viewDisclosures')}
        </Typography>
      </div>
      {renderCta()}
    </div>
  )
}

export default ViewDisclosures
