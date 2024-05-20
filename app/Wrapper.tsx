'use client'

import React from 'react'
import Main from './Main'
import Providers from './Providers'
import '../src/i18n'

const Wrapper = () => {
  return (
    <Providers>
      <Main />
    </Providers>
  )
}

export default Wrapper
