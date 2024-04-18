import { fetchBeaconNodeVersion, fetchValidatorVersion } from './api/config'
import Wrapper from './Wrapper'
import '../src/global.css'

export default async function Page() {
  const bnVersion = await fetchBeaconNodeVersion()
  const lighthouseVersion = await fetchValidatorVersion()

  return (
    <Wrapper
      lighthouseVersion={lighthouseVersion?.version}
      beaconNodeVersion={bnVersion?.version}
    />
  )
}
