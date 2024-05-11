import { FC, ReactElement } from 'react'
import { Control, useForm } from 'react-hook-form'

export interface AuthFormProps {
  children: (props: RenderProps) => ReactElement
  onSubmit: (token: string) => void
}

export interface AuthForm {
  password: string
}

export interface RenderProps {
  control: Control<AuthForm>
  isLoading: boolean
  isValid: boolean
  onClick: () => void
}

const AuthenticationForm: FC<AuthFormProps> = ({ children, onSubmit }) => {
  const {
    control,
    watch,
  } = useForm<AuthForm>({
    defaultValues: {
      password: '',
    },
    mode: 'onChange'
  })

  const password = watch('password')

  const onClick = () => onSubmit(password)

  return (
    <form className='w-full h-full' action=''>
      {children &&
        children({
          control,
          isLoading: false,
          isValid: !!password,
          onClick,
        })}
    </form>
  )
}

export default AuthenticationForm
