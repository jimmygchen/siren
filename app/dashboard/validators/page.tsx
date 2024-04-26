import '../../../src/global.css'
import {
  fetchBeaconSpec,
  fetchNodeHealth,
  fetchSyncData,
  fetchValidatorCountData,
} from '../../api/beacon'
import { fetchValCaches, fetchValMetrics, fetchValStates } from '../../api/validator';
import Wrapper from './Wrapper'

export default async function Page() {
  const bnHealth = await fetchNodeHealth()
  const beaconSpec = await fetchBeaconSpec()
  const validatorCount = await fetchValidatorCountData()
  const syncData = await fetchSyncData()
  const states = await fetchValStates()
  const caches = await fetchValCaches()
  const metrics = await fetchValMetrics()

  return (
    <Wrapper
      initValMetrics={metrics}
      initNodeHealth={bnHealth}
      initSyncData={syncData}
      initValStates={states}
      initValCaches={caches}
      initValidatorCountData={validatorCount}
      beaconSpec={beaconSpec}
    />
  )
}
