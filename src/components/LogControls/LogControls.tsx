import React, { FC, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { LogTypeOptions } from '../../constants/constants'
import { LogType } from '../../types'
import Button, { ButtonFace } from '../Button/Button'
import SelectDropDown, { OptionType } from '../SelectDropDown/SelectDropDown'
import { SSEContext } from '../SSELogProvider/SSELogProvider'
import Toggle from '../Toggle/Toggle'
import Typography from '../Typography/Typography'

export interface LogControlsProps {
  logType: LogType
  onTypeSelect: (selection: OptionType) => void
  onSetLoading: (value: boolean) => void
}

const LogControls: FC<LogControlsProps> = React.memo(function ({
  logType,
  onTypeSelect,
  onSetLoading,
}) {
  const { t } = useTranslation()

  const { intervalId, clearRefreshInterval, startRefreshInterval, triggerRefresh } =
    useContext(SSEContext)

  const toggleTriggerInterval = (value: boolean) => {
    if (!value) {
      clearRefreshInterval()
      return
    }

    startRefreshInterval()
  }

  const manualRefresh = () => {
    onSetLoading(true)
    triggerRefresh()
    setTimeout(() => {
      onSetLoading(false)
    }, 500)
  }

  return (
    <div className='flex flex-col w-full space-y-4 lg:space-y-0 lg:flex-row lg:space-x-20'>
      <Typography fontWeight='font-light' type='text-subtitle1'>
        {t('logs.title')}
      </Typography>
      <div className='flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-20'>
        <div>
          <Typography
            type='text-caption2'
            color='text-dark500'
            darkMode='dark:text-dark500'
            isUpperCase
          >
            {t('logs.service')}
          </Typography>
          <SelectDropDown value={logType} onSelect={onTypeSelect} options={LogTypeOptions} />
        </div>
        <div className='flex space-x-2'>
          <div className='flex items-center space-x-3'>
            <Typography
              type='text-caption2'
              color='text-dark500'
              darkMode='dark:text-dark500'
              family='font-archivo'
              isUpperCase
            >
              {t('logs.autoRefresh')}
            </Typography>
            <Toggle
              id='triggerIntervalToggle'
              value={Boolean(intervalId)}
              onChange={toggleTriggerInterval}
            />
          </div>
          <Button type={ButtonFace.ICON} isDisabled={Boolean(intervalId)} onClick={manualRefresh}>
            <i className='bi-arrow-clockwise text-3xl' />
          </Button>
        </div>
      </div>
    </div>
  )
})

LogControls.displayName = 'LogControls'

export default LogControls
