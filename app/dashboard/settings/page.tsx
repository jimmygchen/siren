import '../../../src/global.css'
import { fetchBeaconSpec, fetchNodeHealth, fetchSyncData } from '../../api/beacon'
import { fetchBeaconNodeVersion, fetchValidatorVersion } from '../../api/config'
import Wrapper from './Wrapper'

export default async function Page() {
  const beaconSpec = await fetchBeaconSpec()
  const syncData = await fetchSyncData()
  const nodeHealth = await fetchNodeHealth()
  const bnVersion = await fetchBeaconNodeVersion()
  const lighthouseVersion = await fetchValidatorVersion()

  return (
    <Wrapper
      initSyncData={syncData}
      beaconSpec={beaconSpec}
      initNodeHealth={nodeHealth}
      lighthouseVersion={lighthouseVersion.version}
      bnVersion={bnVersion.version}
    />
  )
}
