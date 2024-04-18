import { FC } from 'react'
import AlertInfo, { AlertInfoProps } from './AlertInfo'
import HardwareInfo, { HardwareInfoProps } from './HardwareInfo'
import LogsInfo from './LogsInfo'

export interface DiagnosticTableProps extends HardwareInfoProps, AlertInfoProps {}

const DiagnosticTable: FC<DiagnosticTableProps> = (props) => {
  return (
    <div className='flex-1 flex flex-col space-y-4 md:space-y-0 md:flex-row mt-2 w-full'>
      <HardwareInfo {...props} />
      <LogsInfo />
      <AlertInfo {...props} />
    </div>
  )
}

export default DiagnosticTable
