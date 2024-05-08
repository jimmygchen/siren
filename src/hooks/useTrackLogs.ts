import { throttle } from 'lodash'
import { useCallback, useEffect, useRef } from 'react'
import { MAX_PERSISTED_LOGS } from '../constants/constants'
import { SSELog } from '../types'

export type trackedLogData = {
  data: SSELog[]
}

export const defaultLogData = {
  data: [],
}

const useTrackLogs = (url: string, onError: () => void, isReady: boolean): trackedLogData => {
  const dataRef = useRef<SSELog[]>([])

  const trackLogs = useCallback(
    (event: MessageEvent) => {
      let newData

      try {
        newData = JSON.parse(JSON.parse(event.data))
      } catch (e) {
        newData = JSON.parse(event.data) as SSELog
      }
      const newDataString = JSON.stringify(newData)

      const existingIndex = dataRef.current.findIndex(
        (data) => JSON.stringify(data) === newDataString,
      )

      if (existingIndex === -1) {
        if (dataRef.current.length >= MAX_PERSISTED_LOGS) {
          dataRef.current.shift()
        }
        dataRef.current.push(newData)
      }
    },
    [dataRef],
  )

  const eventSourceRef = useRef<EventSource | null>(null)
  const controllerRef = useRef<AbortController | null>(null)
  const errorCountRef = useRef<number>(0)

  useEffect(() => {
    if (!url || !isReady) return

    const controller = new AbortController()
    controllerRef.current = controller

    const eventSource = new EventSource(url)
    eventSourceRef.current = eventSource

    const throttledCallback = throttle(trackLogs, 0)
    eventSource.onmessage = (event) => throttledCallback(event)

    eventSource.onerror = () => {
      if (errorCountRef.current++ >= 2) {
        controller.abort()
        eventSource.close()
        eventSourceRef.current = null
        onError?.()
      }
    }

    eventSource.onopen = () => {
      errorCountRef.current = 0
    }

    return () => {
      eventSource.close()
      eventSourceRef.current = null
      controllerRef.current = null
    }
  }, [url, trackLogs, onError, isReady])

  return {
    data: dataRef.current,
  }
}

export default useTrackLogs
