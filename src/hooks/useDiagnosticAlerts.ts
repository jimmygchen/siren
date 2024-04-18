import { useCallback, useMemo } from 'react'
import { useRecoilState } from 'recoil'
import { alertLogs } from '../recoil/atoms'
import { AlertMessage } from '../types'

const useDiagnosticAlerts = () => {
  const [alerts, setAlerts] = useRecoilState(alertLogs)

  const storeAlert = useCallback(
    (alert: AlertMessage) => {
      setAlerts((prevAlerts) => {
        const exists = prevAlerts.some(({ id }) => id === alert.id)
        if (!exists) {
          return [...prevAlerts, alert]
        }
        return prevAlerts
      })
    },
    [setAlerts],
  )

  const updateAlert = useCallback(
    (alert: AlertMessage) => {
      setAlerts((prevAlerts) => {
        const existsAndNotDismissed = prevAlerts.some(
          ({ id, isDismissed }) => id === alert.id && !isDismissed,
        )
        if (existsAndNotDismissed) {
          const newAlerts = prevAlerts.filter(({ id }) => id !== alert.id)
          return [...newAlerts, alert]
        }
        return prevAlerts
      })
    },
    [setAlerts],
  )

  const dismissAlert = useCallback(
    (alert: AlertMessage) => {
      setAlerts((prevAlerts) => {
        const targetIndex = prevAlerts.findIndex(({ id }) => id === alert.id)

        if (targetIndex !== -1 && !prevAlerts[targetIndex].isDismissed) {
          const newAlerts = [...prevAlerts]
          newAlerts[targetIndex] = { ...newAlerts[targetIndex], isDismissed: true }
          return newAlerts
        }

        return prevAlerts
      })
    },
    [setAlerts],
  )

  const removeAlert = useCallback(
    (id: string) => {
      setAlerts((prevAlerts) => {
        const exists = prevAlerts.some((alert) => alert.id === id)
        if (exists) {
          return prevAlerts.filter((alert) => alert.id !== id)
        }
        return prevAlerts
      })
    },
    [setAlerts],
  )

  const resetDismissed = useCallback(() => {
    setAlerts((prevAlerts) => {
      return prevAlerts.filter((alert) => !alert.isDismissed)
    })
  }, [setAlerts])

  const formattedList = useMemo(() => {
    return alerts.filter(({ isDismissed }) => isDismissed !== true)
  }, [alerts])

  return {
    alerts: formattedList,
    storeAlert,
    updateAlert,
    dismissAlert,
    removeAlert,
    resetDismissed,
  }
}

export default useDiagnosticAlerts
