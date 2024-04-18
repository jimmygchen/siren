'use client'

import React, { FC } from 'react'
import Providers from '../../Providers'
import Content from './Content'
import { MainProps } from './Main'
import '../../../src/i18n'

const Wrapper: FC<MainProps> = (props) => {
  return (
    <Providers>
      <Content {...props} />
    </Providers>
  )
}

export default Wrapper
