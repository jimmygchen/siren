import '../../../src/global.css'
import { fetchBeaconSpec, fetchNodeHealth, fetchSyncData } from '../../api/beacon'
import Wrapper from './Wrapper'

export default async function Page() {
  const nodeHealth = await fetchNodeHealth()
  const beaconSpec = await fetchBeaconSpec()
  const syncData = await fetchSyncData()

  return <Wrapper initNodeHealth={nodeHealth} beaconSpec={beaconSpec} initSyncData={syncData} />
}
