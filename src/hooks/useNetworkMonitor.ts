import { useRecoilState } from 'recoil'
import { beaconNetworkError, validatorNetworkError } from '../recoil/atoms'
import useSWRPolling from './useSWRPolling'

const useNetworkMonitor = () => {
  const [isBeaconError, setBeaconNetworkError] = useRecoilState(beaconNetworkError)
  const [isValidatorError, setValidatorNetworkError] = useRecoilState(validatorNetworkError)

  const notifyBnDisconnect = () => setBeaconNetworkError(true)
  const notifyValDisconnect = () => setValidatorNetworkError(true)

  useSWRPolling('/api/beacon-heartbeat', { refreshInterval: 6000 }, notifyBnDisconnect)
  useSWRPolling('/api/validator-heartbeat', { refreshInterval: 6000 }, notifyValDisconnect)

  return {
    isBeaconError,
    isValidatorError,
  }
}

export default useNetworkMonitor
