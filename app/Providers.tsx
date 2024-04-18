'use client'

import React, { FC, ReactElement } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ToastContainer } from 'react-toastify'
import { RecoilRoot } from 'recoil'
import 'react-tooltip/dist/react-tooltip.css'
import 'react-toastify/dist/ReactToastify.min.css'
import 'rodal/lib/rodal.css'

const queryClient = new QueryClient()

export interface ProviderProps {
  children: ReactElement | ReactElement[]
}

const Providers: FC<ProviderProps> = ({ children }) => {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        {children}
        <ToastContainer />
      </QueryClientProvider>
    </RecoilRoot>
  )
}

export default Providers
