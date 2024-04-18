import { Story } from '@storybook/react'
import { StatusColor } from '../../types'
import Status, { StatusProps } from './Status'

const StatusStory = {
  title: 'Status Dot',
  component: Status,
}

const Template: Story<StatusProps> = (props) => <Status {...props} />

export const Success = Template.bind({})
Success.args = {
  status: StatusColor.SUCCESS,
}

export const Warning = Template.bind({})
Warning.args = {
  status: StatusColor.WARNING,
}

export const Error = Template.bind({})
Error.args = {
  status: StatusColor.ERROR,
}

export default StatusStory
