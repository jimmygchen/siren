import '../../../src/global.css'
import { fetchBeaconSpec, fetchNodeHealth, fetchSyncData } from '../../api/beacon'
import Wrapper from './Wrapper'

export default async function Page() {
  const beaconSpec = await fetchBeaconSpec()
  const syncData = await fetchSyncData()
  const nodeHealth = await fetchNodeHealth()

  return <Wrapper initSyncData={syncData} beaconSpec={beaconSpec} initNodeHealth={nodeHealth} />
}
