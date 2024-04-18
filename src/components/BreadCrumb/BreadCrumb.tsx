import { FC } from 'react'
import Typography from '../Typography/Typography'

export interface BreadCrumbProps {
  previous: string
  current: string
}

const BreadCrumb: FC<BreadCrumbProps> = ({ previous, current }) => {
  return (
    <div className='cursor-pointer flex space-x-2 items-center'>
      <i className='text-caption2 bi-arrow-left' />
      <Typography type='text-caption2' className='uppercase'>
        {previous} / <span className='font-bold'>{current}</span>
      </Typography>
    </div>
  )
}

export default BreadCrumb
