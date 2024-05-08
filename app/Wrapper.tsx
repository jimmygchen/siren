'use client'

import React from 'react'
import Main from './Main'
import Providers from './Providers'
import '../src/i18n'

const Wrapper = (props) => {
  return (
    <Providers>
      <Main {...props} />
    </Providers>
  )
}

export default Wrapper
