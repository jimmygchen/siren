import '../../../src/global.css'
import { cookies } from 'next/headers';
import { fetchBeaconSpec, fetchSyncData } from '../../api/beacon'
import Wrapper from './Wrapper'

export default async function Page() {
  const cookieStore = cookies()
  const token = cookieStore?.get('session-token')?.value || ''

  const beaconSpec = await fetchBeaconSpec(token)
  const syncData = await fetchSyncData(token)

  return <Wrapper beaconSpec={beaconSpec} initSyncData={syncData} />
}
