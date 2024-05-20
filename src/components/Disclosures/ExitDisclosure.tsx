import React, { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import validatorDisclosure from '../../assets/images/validatorDisclosure.png'
import DisclosureModal from '../DisclosureModal/DisclosureModal'
import Typography from '../Typography/Typography'
import ViewDisclosures, { ViewDisclosuresProps } from '../ViewDisclosures/ViewDisclosures'

export type ExitDisclosureProps = Omit<ViewDisclosuresProps, 'onClick'> & {
  isLoading?: boolean
}

const ExitDisclosure: FC<ExitDisclosureProps> = (props) => {
  const { t } = useTranslation()
  const [isOpen, toggleModal] = useState(false)

  const openModal = () => toggleModal(true)
  const closeModal = () => toggleModal(false)

  return (
    <>
      <ViewDisclosures {...props} onClick={openModal} />
      <DisclosureModal
        backgroundImage={validatorDisclosure.src}
        onClose={closeModal}
        isOpen={isOpen}
      >
        <Typography type='text-subtitle2' fontWeight='font-light' className='mb-8'>
          {t('disclosure.exitValidator.title')}
        </Typography>
        <div className='mb-6'>
          <Typography color='text-dark500' fontWeight='font-light'>
            {t('disclosure.exitValidator.text1')}
          </Typography>
        </div>
        <div className='mb-12'>
          <Typography color='text-dark500' fontWeight='font-light'>
            {t('disclosure.exitValidator.text2')}
          </Typography>
        </div>
      </DisclosureModal>
    </>
  )
}

export default ExitDisclosure
