import axios from 'axios';
import {cookies} from 'next/headers';
import { FC, ReactElement } from 'react'
import { Control, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export interface AuthFormProps {
  children: (props: RenderProps) => ReactElement
  onSuccess: (token: string) => void
}

export interface AuthForm {
  password: string
}

export interface RenderProps {
  control: Control<AuthForm>
  isLoading: boolean
  isValid: boolean
  onSubmit: () => void
}

const AuthenticationForm: FC<AuthFormProps> = ({ children, onSuccess }) => {
  const { t } = useTranslation()

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

  const onSubmit = async () => {
    try {
      const res = await axios.post('/api/authenticate', {password})

      if(res.status === 200) {
        onSuccess(res.data.token)
      }

    } catch (e) {
      console.log(e, 'error')
    }
  }

  return (
    <form className='w-full h-full' action=''>
      {children &&
        children({
          control,
          isLoading: false,
          isValid: !!password,
          onSubmit,
        })}
    </form>
  )
}

export default AuthenticationForm
