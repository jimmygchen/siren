import { useState } from 'react'
import useSWR, { SWRResponse } from 'swr'
import swrGetFetcher from '../../utilities/swrGetFetcher'

const useSWRPolling = <T = any>(
  api: string | null,
  config?: {
    refreshInterval?: number
    fallbackData?: any
    errorRetryCount?: number
    networkError?: boolean
  },
  callBack?: (url: string | null) => void,
): SWRResponse<T, any> => {
  const { refreshInterval = 12000, fallbackData, errorRetryCount = 2, networkError } = config || {}
  const [errorCount, setErrors] = useState(0)

  const incrementCount = () => {
    if (errorCount < errorRetryCount) {
      setErrors((prev) => prev + 1)
      return
    }

    callBack?.(api)
  }

  return useSWR<T>(errorCount <= errorRetryCount && !networkError ? api : null, swrGetFetcher, {
    refreshInterval,
    fallbackData,
    errorRetryCount,
    onError: incrementCount,
  })
}

export default useSWRPolling
