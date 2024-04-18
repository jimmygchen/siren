import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DiscordUrl, LighthouseBookUrl } from '../../constants/constants'
import useClickOutside from '../../hooks/useClickOutside'
import DropDown from '../DropDown/DropDown'
import DropDownItem from '../DropDown/DropDownItem'
import Typography from '../Typography/Typography'

const DashboardOptions = () => {
  const { t } = useTranslation()
  const [isOpen, toggle] = useState(false)

  const { ref } = useClickOutside<HTMLDivElement>(() => toggle(false))
  const openOptions = () => toggle(true)

  return (
    <div ref={ref} className='relative'>
      <i
        onClick={openOptions}
        className='bi bi-three-dots dark:text-white flex-grow-0 -mt-2 cursor-pointer'
      />
      <DropDown position='top-full -left-24 lg:-left-12 z-top98' width='w-fit' isOpen={isOpen}>
        <DropDownItem href='/dashboard/settings'>
          <div className='w-full flex space-x-2'>
            <i className='bi bi-gear-fill' />
            <Typography className='capitalize'>{t('sidebar.settings')}</Typography>
          </div>
        </DropDownItem>
        <DropDownItem target='_blank' href={DiscordUrl}>
          <div className='w-full flex space-x-2'>
            <i className='bi bi-discord' />
            <Typography className='capitalize'>Discord</Typography>
          </div>
        </DropDownItem>
        <DropDownItem target='_blank' href={LighthouseBookUrl}>
          <div className='w-full flex space-x-2'>
            <i className='bi bi-life-preserver' />
            <Typography className='capitalize'>{t('documentation')}</Typography>
          </div>
        </DropDownItem>
      </DropDown>
    </div>
  )
}

export default DashboardOptions
