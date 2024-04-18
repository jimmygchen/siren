import { Story } from '@storybook/react'
import FootBar from './FootBar'

const FootBarStory = {
  key: 'FootBar',
  component: FootBar,
}

const Template: Story = () => <FootBar />

export const Base = Template.bind({})
Base.args = {}

export default FootBarStory
