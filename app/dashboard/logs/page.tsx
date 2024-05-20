import '../../../src/global.css'
import { cookies, headers } from 'next/headers';
import { fetchBeaconSpec, fetchNodeHealth, fetchSyncData } from '../../api/beacon'
import { fetchLogMetrics } from '../../api/logs';
import Wrapper from './Wrapper'

export default async function Page() {
  const cookieStore = cookies()
  const token = cookieStore?.get('session-token')?.value || ''

  const logMetrics = await fetchLogMetrics(token)

  const beaconSpec = await fetchBeaconSpec(token)
  const syncData = await fetchSyncData(token)
  const nodeHealth = await fetchNodeHealth(token)

  return <Wrapper initLogMetrics={logMetrics} initSyncData={syncData} beaconSpec={beaconSpec} initNodeHealth={nodeHealth} />
}
