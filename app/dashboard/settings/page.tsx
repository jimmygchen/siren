import '../../../src/global.css'
import getSessionCookie from '../../../utilities/getSessionCookie';
import { fetchBeaconSpec, fetchNodeHealth, fetchSyncData } from '../../api/beacon'
import { fetchBeaconNodeVersion, fetchValidatorVersion } from '../../api/config'
import Wrapper from './Wrapper'

export default async function Page() {
  const token = getSessionCookie()

  const beaconSpec = await fetchBeaconSpec(token)
  const syncData = await fetchSyncData(token)
  const nodeHealth = await fetchNodeHealth(token)
  const bnVersion = await fetchBeaconNodeVersion(token)
  const lighthouseVersion = await fetchValidatorVersion(token)

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
