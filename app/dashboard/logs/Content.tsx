import { FC } from 'react'
import SSELogProvider from '../../../src/components/SSELogProvider/SSELogProvider'
import Main, { MainProps } from './Main'

const Content: FC<MainProps> = (props) => {
  return (
    <SSELogProvider>
      <Main {...props} />
    </SSELogProvider>
  )
}

export default Content
