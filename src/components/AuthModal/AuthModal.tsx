import { FC } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { UiMode } from '../../constants/enums';
import AuthenticationForm, { AuthFormProps } from '../../forms/AuthenticationForm';
import Button, { ButtonFace } from '../Button/Button';
import Input from '../Input/Input';
import RodalModal from '../RodalModal/RodalModal';

export interface AuthModalProps extends Omit<AuthFormProps, 'children'>{
  isVisible: boolean
}

const AuthModal:FC<AuthModalProps> = ({onSubmit, isVisible}) => {
  const {t} = useTranslation()

  return (
    <RodalModal styles={{ maxWidth: '500px' }} isVisible={isVisible}>
      <AuthenticationForm onSubmit={onSubmit}>
        {({control, onClick, isValid, isLoading}) => (
          <div className="p-6">
            Authenticate
            <div>
              <Controller
                name='password'
                control={control as any}
                render={({ field: { ref: _ref, ...props }, fieldState }) => (
                  <Input
                    isAutoFocus
                    type="password"
                    uiMode={UiMode.LIGHT}
                    error={fieldState.error?.message}
                    label={t('session password')}
                    {...props}
                  />
                )}
              />
              <div className="w-full flex items-center justify-center">
                <Button onClick={onClick} isDisabled={!isValid} isLoading={isLoading} className="mt-4" type={ButtonFace.SECONDARY}>Submit</Button>
              </div>
            </div>
          </div>
        )}
      </AuthenticationForm>
    </RodalModal>
  )
}

export default AuthModal;