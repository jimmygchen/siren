import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'
import { CURRENCIES } from '../../constants/constants'
import { exchangeRates } from '../../recoil/atoms'
import SelectDropDown, { OptionType } from '../SelectDropDown/SelectDropDown';

export interface CurrencySelectProps {
  onSelect: (selection: OptionType) => void
  selection: string
}

const CurrencySelect: FC<CurrencySelectProps> = ({ selection, onSelect }) => {
  const { t } = useTranslation()
  const data = useRecoilValue(exchangeRates)

  const currencyOptions = data
    ? [...data.currencies]
        .filter((currency) => CURRENCIES.includes(currency))
        .sort()
        .map((currency) => ({ title: currency }))
    : []

  return (
    <SelectDropDown
      isFilter
      color='text-white'
      label={t('accountEarnings.chooseCurrency')}
      value={selection}
      onSelect={onSelect}
      options={currencyOptions}
    />
  )
}

export default CurrencySelect
