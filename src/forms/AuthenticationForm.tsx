import { FC, ReactElement, useEffect } from 'react';
import { Control, useForm } from 'react-hook-form'

export interface AuthFormProps {
  children: (props: RenderProps) => ReactElement
  onSubmit: (token: string) => void
  isVisible: boolean
}

export interface AuthForm {
  password: string
}

export interface RenderProps {
  control: Control<AuthForm>
  isValid: boolean
  onClick: () => void
}

const AuthenticationForm: FC<AuthFormProps> = ({ children, onSubmit, isVisible }) => {
  const {
    control,
    watch,
    reset,
  } = useForm<AuthForm>({
    defaultValues: {
      password: '',
    },
    mode: 'onChange'
  })

  useEffect(() => {
    if(!isVisible) {
      reset()
    }
  }, [isVisible, reset])

  const password = watch('password')

  const onClick = () => onSubmit(password)

  return (
    <form className='w-full h-full' action=''>
      {children &&
        children({
          control,
          isValid: !!password,
          onClick,
        })}
    </form>
  )
}

export default AuthenticationForm
