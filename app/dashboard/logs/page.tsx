import '../../../src/global.css'
import getSessionCookie from '../../../utilities/getSessionCookie';
import { fetchBeaconSpec, fetchNodeHealth, fetchSyncData } from '../../api/beacon'
import { fetchLogMetrics } from '../../api/logs';
import Wrapper from './Wrapper'

export default async function Page() {
  const token = getSessionCookie()

  const logMetrics = await fetchLogMetrics(token)
  const beaconSpec = await fetchBeaconSpec(token)
  const syncData = await fetchSyncData(token)
  const nodeHealth = await fetchNodeHealth(token)

  return <Wrapper initLogMetrics={logMetrics} initSyncData={syncData} beaconSpec={beaconSpec} initNodeHealth={nodeHealth} />
}
