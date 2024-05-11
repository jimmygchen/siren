import { useRouter } from 'next/navigation'
import Carousel from 'nuka-carousel'
import { createContext, FC, useEffect, useMemo, useState } from 'react'
import formatValidatorEpochData from '../../../utilities/formatValidatorEpochData'
import { ValidatorModalView } from '../../constants/enums'
import useMediaQuery from '../../hooks/useMediaQuery'
import useSWRPolling from '../../hooks/useSWRPolling';
import { ValidatorMetricResult } from '../../types/beacon';
import { ValidatorBalanceInfo } from '../../types/validator'
import RodalModal from '../RodalModal/RodalModal'
import Spinner from '../Spinner/Spinner'
import ValidatorDetails, { ValidatorDetailsProps } from './views/ValidatorDetails'
import ValidatorExit from './views/ValidatorExit'

export interface ValidatorModalContextProps {
  moveToView: (view: ValidatorModalView) => void
  closeModal: () => void
}

export const ValidatorModalContext = createContext<ValidatorModalContextProps>({
  moveToView: () => {},
  closeModal: () => {},
})

export interface ValidatorModalProps extends Omit<ValidatorDetailsProps, 'validatorMetrics'> {}

const ValidatorModal: FC<ValidatorModalProps> = ({
  validator,
  validatorCacheData,
}) => {
  const [isReady, setReady] = useState(false)
  const router = useRouter()
  const [activeIndex, setIndex] = useState(0)
  const [view, setView] = useState<ValidatorModalView>(ValidatorModalView.EXIT)
  const isTablet = useMediaQuery('(max-width: 768px)')
  const isLargeScreen = useMediaQuery('(min-width: 1540px)')
  const { index } = validator

  const { data: validatorMetric } = useSWRPolling<ValidatorMetricResult>(
    `/api/validator-metrics?index=${index}`,
    { refreshInterval: 5 * 1000 },
  )

  const validatorEpochData = useMemo<ValidatorBalanceInfo>(() => {
    return formatValidatorEpochData([validator], validatorCacheData)
  }, [validator, validatorCacheData])

  useEffect(() => {
    setReady(true)
  }, [])

  const closeModal = () => {
    router.push('/dashboard/validators')
    setTimeout(() => {
      setView(ValidatorModalView.DETAILS)
      setIndex(0)
    }, 1000)
  }
  const renderContent = () => {
    if (!validator) return null

    switch (view) {
      case ValidatorModalView.EXIT:
        return <ValidatorExit validatorEpochData={validatorEpochData} validator={validator} />
      default:
        return <div />
    }
  }

  const moveToView = (view: ValidatorModalView) => {
    if (view === ValidatorModalView.DETAILS) {
      setIndex(0)
      setTimeout(() => {
        setView(view)
      }, 200)
      return
    }

    setView(view)
    setTimeout(() => {
      setIndex(1)
    }, 200)
  }

  return (
    <RodalModal
      isVisible={!!validator && isReady}
      styles={{
        width: 'fit-content',
        maxWidth: isTablet ? '99%' : isLargeScreen ? '1200px' : '900px',
        height: isTablet ? '540px' : 'max-content',
      }}
      onClose={closeModal}
    >
      {validator && validatorMetric ? (
        <ValidatorModalContext.Provider value={{ moveToView, closeModal }}>
          <Carousel swiping={false} slideIndex={activeIndex} dragging={false} withoutControls>
            <ValidatorDetails
              validator={validator}
              validatorCacheData={validatorCacheData}
              validatorMetrics={validatorMetric}
            />
            {renderContent()}
          </Carousel>
        </ValidatorModalContext.Provider>
      ) : (
        <div className='w-500 h-640 flex items-center justify-center'>
          <Spinner />
        </div>
      )}
    </RodalModal>
  )
}

export default ValidatorModal
