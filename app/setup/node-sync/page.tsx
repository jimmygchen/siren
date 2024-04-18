import '../../../src/global.css'
import { fetchBeaconSpec, fetchSyncData } from '../../api/beacon';
import Wrapper from './Wrapper';

export default async function Page() {
  const beaconSpec = await fetchBeaconSpec()
  const syncData = await fetchSyncData()

  return (
    <Wrapper
      beaconSpec={beaconSpec}
      initSyncData={syncData}
    />
  )
}