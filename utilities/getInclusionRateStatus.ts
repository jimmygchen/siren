import { StatusColor } from '../src/types'

const getStatus = (rate?: number) => {
  if (!rate) return StatusColor.DARK
  switch (true) {
    case rate >= 95:
      return StatusColor.SUCCESS
    case rate < 95 && rate > 75:
      return StatusColor.WARNING
    default:
      return StatusColor.ERROR
  }
}

export default getStatus
