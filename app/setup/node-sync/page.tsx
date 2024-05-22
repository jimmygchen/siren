import '../../../src/global.css'
import getSessionCookie from '../../../utilities/getSessionCookie';
import { fetchBeaconSpec, fetchSyncData } from '../../api/beacon'
import Wrapper from './Wrapper'

export default async function Page() {
  const token = getSessionCookie()

  const beaconSpec = await fetchBeaconSpec(token)
  const syncData = await fetchSyncData(token)

  return <Wrapper beaconSpec={beaconSpec} initSyncData={syncData} />
}
