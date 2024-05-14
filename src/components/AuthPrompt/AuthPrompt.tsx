import Image from 'next/image';
import { FC } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Lighthouse from '../../assets/images/lightHouse.svg'
import Waves from '../../assets/images/waves.png';
import { UiMode } from '../../constants/enums';
import AuthenticationForm, { AuthFormProps } from '../../forms/AuthenticationForm';
import Button, { ButtonFace } from '../Button/Button';
import Input from '../Input/Input';
import RodalModal from '../RodalModal/RodalModal';
import Typography from '../Typography/Typography';

export interface AuthModalProps extends Omit<AuthFormProps, 'children'>{
  isVisible: boolean
  isLoading: boolean
  onClose?: () => void
  mode: UiMode
}

const AuthPrompt:FC<AuthModalProps> = ({onSubmit, isVisible, isLoading, mode, onClose}) => {
  const {t} = useTranslation()

  return (
    <RodalModal styles={{ maxWidth: '500px' }} onClose={onClose} isVisible={isVisible}>
      <AuthenticationForm isVisible={isVisible} onSubmit={onSubmit}>
        {({control, onClick, isValid}) => (
          <div>
            <div className="w-full h-24 overflow-hidden bg-gradient-to-r from-primary to-tertiary">
              <Image
                className='z-10 w-full opacity-10'
                alt='waves'
                src={Waves}
              />
            </div>
            <div className="p-6 relative">
              <div className="w-18 h-18 rounded-full p-1 absolute left-1/2 -translate-x-1/2 flex item-center justify-center top-0 -translate-y-1/2 bg-gradient-to-r from-primary to-tertiary">
                <Lighthouse className="text-white"/>
              </div>
              <div className="py-8">
                <Typography type="text-caption1" color="text-dark500">
                  This action requires authentication. Please provide your session password to continue. Please review your configuration file
                  and make appropriate adjustments if necessary.
                </Typography>
              </div>
              <Controller
                name='password'
                control={control as any}
                render={({ field: { ref: _ref, ...props }, fieldState }) => (
                  <Input
                    isAutoFocus
                    autoComplete="new-password"
                    type="password"
                    uiMode={mode}
                    error={fieldState.error?.message}
                    {...props}
                  />
                )}
              />
              <div className="w-full flex items-center justify-center mt-4">
                <Button onClick={onClick} isDisabled={!isValid} isLoading={isLoading} className="mt-4" type={ButtonFace.SECONDARY}>Submit</Button>
              </div>
            </div>
          </div>
        )}
      </AuthenticationForm>
    </RodalModal>
  )
}

export default AuthPrompt;