import { Story } from '@storybook/react'
import { useState } from 'react'
import { EARNINGS_OPTIONS } from '../../constants/constants'
import SelectDropDown, { OptionType, SelectDropDownProps } from './SelectDropDown'

const SelectDropDownStory = {
  key: 'SelectDropDown',
  component: SelectDropDown,
  title: 'Components/SelectDropDown',
  argTypes: {
    onSelect: { action: 'selected' },
  },
}

const Template: Story<SelectDropDownProps> = (props) => {
  const [selection, makeSelection] = useState<OptionType>(0)
  return <SelectDropDown {...props} value={selection} onSelect={makeSelection} />
}

export const Base = Template.bind({})
Base.args = {
  options: EARNINGS_OPTIONS,
  label: 'Select Currency',
}

export default SelectDropDownStory
