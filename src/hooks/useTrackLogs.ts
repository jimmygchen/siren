import { throttle } from 'lodash';
import moment from 'moment'
import { MutableRefObject, useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next'
import { ALERT_ID, MAX_PERSISTED_LOGS } from '../constants/constants'
import { LogLevels, SSELog, StatusColor } from '../types'
import useDiagnosticAlerts from './useDiagnosticAlerts'

export type trackedLogData = {
  data: SSELog[]
  totalLogsPerHour: number
  criticalPerHour: number
  warningsPerHour: number
  errorsPerHour: number
  cleanLogs: () => void
}

export const defaultLogData = {
  data: [],
  totalLogsPerHour: 0,
  criticalPerHour: 0,
  warningsPerHour: 0,
  errorsPerHour: 0,
  cleanLogs: () => {},
}

const useTrackLogs = (url: string, onError: () => void, isReady: boolean): trackedLogData => {
  const { t } = useTranslation()
  const dataRef = useRef<SSELog[]>([])
  const infoPerHour = useRef<number[]>([])
  const criticalPerHour = useRef<number[]>([])
  const warningsPerHour = useRef<number[]>([])
  const errorsPerHour = useRef<number[]>([])
  const { storeAlert, removeAlert } = useDiagnosticAlerts()

  const incrementCounts = (log: SSELog) => {
    const { level } = log
    const timeNow = moment().unix()

    if (level === LogLevels.CRIT) {
      criticalPerHour.current.push(timeNow)
    }

    if (level === LogLevels.WARN) {
      warningsPerHour.current.push(timeNow)
    }

    if (level === LogLevels.ERRO) {
      errorsPerHour.current.push(timeNow)
    }

    if (level === LogLevels.INFO) {
      infoPerHour.current.push(timeNow)
    }
  }

  const trackLogs = useCallback((event: MessageEvent) => {
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
      incrementCounts(newData)
      if (dataRef.current.length >= MAX_PERSISTED_LOGS) {
        dataRef.current.shift()
      }
      dataRef.current.push(newData)
    }
  }, [dataRef])

  const pruneLogRef = (ref: MutableRefObject<number[]>) => {
    while (ref.current.length > 0) {
      const elementTime = ref.current.shift()

      if (elementTime && moment().diff(moment.unix(elementTime), 'hours') <= 1) {
        ref.current.unshift(elementTime)
        break
      }
    }
  }

  const cleanLogs = () => {
    pruneLogRef(criticalPerHour)
    pruneLogRef(warningsPerHour)
    pruneLogRef(errorsPerHour)
    pruneLogRef(infoPerHour)
  }

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

  const criticalCount = criticalPerHour.current.length
  const infoCount = infoPerHour.current.length
  const warningCount = warningsPerHour.current.length
  const errorCount = errorsPerHour.current.length

  const totalLogsPerHour = criticalCount + warningCount + errorCount + infoCount

  const parsedCrit = useMemo(() => {
    return dataRef.current.filter((data) => data.level === LogLevels.CRIT)
  }, [dataRef, totalLogsPerHour])

  useEffect(() => {
    parsedCrit.forEach((crit) => {
      storeAlert({
        severity: StatusColor.ERROR,
        message: t('alertMessages.critLog', { message: crit.msg }),
        subText: t('poor'),
        id: crit.msg.replace(' ', ''),
      })
    })
  }, [parsedCrit, storeAlert])

  const parsedErrors = useMemo(() => {
    return dataRef.current.filter((data) => data.level === LogLevels.ERRO)
  }, [dataRef, totalLogsPerHour])

  useEffect(() => {
    parsedErrors.forEach((error) => {
      storeAlert({
        severity: StatusColor.ERROR,
        message: t('alertMessages.errorLog', { message: error.msg }),
        subText: t('poor'),
        id: error.msg.replace(' ', ''),
      })
    })
  }, [parsedErrors, storeAlert])

  useEffect(() => {
    if (warningCount > 5) {
      storeAlert({
        id: ALERT_ID.WARNING_LOG,
        message: t('alertMessages.excessiveWarningLogs'),
        severity: StatusColor.WARNING,
        subText: t('fair'),
      })

      return
    }

    removeAlert(ALERT_ID.WARNING_LOG)
  }, [warningCount, storeAlert, removeAlert])

  return {
    data: dataRef.current,
    totalLogsPerHour,
    criticalPerHour: criticalCount,
    warningsPerHour: warningCount,
    errorsPerHour: errorCount,
    cleanLogs,
  }
}

export default useTrackLogs
