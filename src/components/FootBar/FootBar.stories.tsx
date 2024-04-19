import { Story } from '@storybook/react'
import { mockDiagnostics } from '../../mocks/beaconSpec';
import FootBar from './FootBar'

const FootBarStory = {
  key: 'FootBar',
  component: FootBar,
}

const Template: Story = () => <FootBar isSyncing nodeHealth={mockDiagnostics} />

export const Base = Template.bind({})
Base.args = {}

export default FootBarStory
