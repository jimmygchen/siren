import axios from 'axios';
import Cookies from 'js-cookie';
import moment from 'moment';
import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LogData, StatusColor } from '../../types';
import AlertCard from '../AlertCard/AlertCard';

export interface LogAlertsProps {
  alerts: LogData[]
}

const PriorityLogAlerts:FC<LogAlertsProps> = ({alerts}) => {
  const {t} = useTranslation()

  const [data, setData] = useState(alerts)

  useEffect(() => {
    setData(alerts)
  }, [alerts])

  const visibleAlerts = useMemo(() => {
    return data.filter(({isHidden}) => !isHidden)
  }, [data])

  const dismissAlert = async (id) => {
    try {
      const token = Cookies.get('session-token')
      await axios.get(`/api/dismiss-log?index=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setData(prev => {
        let log = prev.find(alert => alert.id === id)

        log.isHidden = true

        return [...prev.filter(alert => alert.id !== id), log]
      })
    } catch (e) {
      console.log('error updating log...')
    }
  }

  return visibleAlerts.map(({id, data, createdAt}) => {
    const alertData = JSON.parse(data)
    const date = moment(createdAt).fromNow()
    return (
      <AlertCard
        key={id}
        status={StatusColor.ERROR}
        count={3}
        onClick={() => dismissAlert(id)}
        subText={t('poor')}
        text={`${alertData.msg} ${date}`}
      />
    )
  })
}

export default PriorityLogAlerts;