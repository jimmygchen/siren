import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import useUiMode from '../../hooks/useUiMode'
import Input from '../Input/Input'

export interface ValidatorSearchInputProps {
  onChange: (value: string) => void
  value: string
}

const ValidatorSearchInput: FC<ValidatorSearchInputProps> = ({ onChange, value }) => {
  const { t } = useTranslation()
  const { mode } = useUiMode()

  return (
    <Input
      uiMode={mode}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      inputStyle='secondary'
      icon='bi-search'
      placeholder={t('search')}
    />
  )
}

export default ValidatorSearchInput
