import '../../../src/global.css'
import { cookies } from 'next/headers';
import { fetchBeaconSpec, fetchNodeHealth, fetchSyncData } from '../../api/beacon'
import Wrapper from './Wrapper'

export default async function Page() {
  const cookieStore = cookies()
  const token = cookieStore.get('session-token').value

  const nodeHealth = await fetchNodeHealth(token)
  const beaconSpec = await fetchBeaconSpec(token)
  const syncData = await fetchSyncData(token)

  return <Wrapper initNodeHealth={nodeHealth} beaconSpec={beaconSpec} initSyncData={syncData} />
}
