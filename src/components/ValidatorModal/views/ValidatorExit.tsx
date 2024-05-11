import { FC, useContext, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import addClassString from '../../../../utilities/addClassString'
import { ValidatorModalView } from '../../../constants/enums'
import useExitValidator from '../../../hooks/useExitValidator'
import AuthModal from '../../AuthModal/AuthModal';
import BasicValidatorMetrics, {
  BasicValidatorMetricsProps,
} from '../../BasicValidatorMetrics/BasicValidatorMetrics'
import Button, { ButtonFace } from '../../Button/Button'
import ExitDisclosure from '../../Disclosures/ExitDisclosure'
import InfoBox, { InfoBoxType } from '../../InfoBox/InfoBox'
import Typography from '../../Typography/Typography'
import ValidatorInfoHeader from '../../ValidatorInfoHeader/ValidatorInfoHeader'
import { ValidatorModalContext } from '../ValidatorModal'

export interface ValidatorExitProps extends BasicValidatorMetricsProps {}

const ValidatorExit: FC<ValidatorExitProps> = ({ validator, validatorEpochData }) => {
  const { t } = useTranslation()
  const { pubKey } = validator
  const [isLoading, setLoading] = useState(false)
  const [isAccept, setIsAccept] = useState(false)
  const [isAuthPrompt, setAuthPrompt] = useState(false)
  const { moveToView, closeModal } = useContext(ValidatorModalContext)
  const viewDetails = () => moveToView(ValidatorModalView.DETAILS)
  const { getSignedExit, submitSignedMessage } = useExitValidator(pubKey)

  const acceptBtnClasses = addClassString('', [isAccept && 'border-success !text-success'])
  const checkMarkClasses = addClassString('bi bi-check-circle ml-4', [isAccept && 'text-success'])

  const confirmExit = async (password: string) => {
    setLoading(true)

    const message = await getSignedExit(password)

    if (message) {
      await submitSignedMessage({data: message, password})
      closeModal()
    }
  }
  const toggleAccept = () => setIsAccept((prev) => !prev)
  const triggerPrompt = () => setAuthPrompt(true)

  return (
    <>
      <div className='pt-2 exit-validator-modal relative'>
        <AuthModal isVisible={isAuthPrompt} onSubmit={confirmExit}/>
        <div className='py-4 px-6 flex justify-between'>
          <div className='space-x-4 flex items-center'>
            <i onClick={viewDetails} className='bi-chevron-left dark:text-dark300 cursor-pointer' />
            <Typography type='text-subtitle1' fontWeight='font-light'>
              {t('validatorExit.exit')}
            </Typography>
          </div>
          <BasicValidatorMetrics validatorEpochData={validatorEpochData} validator={validator} />
        </div>
        <ValidatorInfoHeader validator={validator} />
        <div className='p-6 space-y-6'>
          <Typography type='text-caption1' isBold isUpperCase>
            <Trans i18nKey='validatorExit.management'>
              <br />
            </Trans>{' '}
            ---
          </Typography>
          <InfoBox type={InfoBoxType.ERROR}>
            <div>
              <Typography type='text-caption1' className='mb-3' darkMode='text-dark900'>
                {t('validatorExit.warning')}
              </Typography>
              <a href=''>
                <Typography type='text-caption1' className='underline' darkMode='text-error'>
                  {t('validatorExit.learnMore')}
                </Typography>
              </a>
            </div>
          </InfoBox>
          <Button onClick={toggleAccept} className={acceptBtnClasses} type={ButtonFace.TERTIARY}>
            {t('validatorExit.iAccept')}
            <i className={checkMarkClasses} />
          </Button>
        </div>
        <div className='p-3 border-t-style100'>
          <ExitDisclosure
            isSensitive
            isLoading={isLoading}
            isDisabled={!isAccept}
            onAccept={triggerPrompt}
            ctaType={ButtonFace.SECONDARY}
            ctaText={t('validatorExit.exit')}
          />
        </div>
      </div>
    </>
  )
}

export default ValidatorExit
