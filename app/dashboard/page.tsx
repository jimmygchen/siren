import '../../src/global.css'
import {
  fetchBeaconSpec, fetchInclusionRate, fetchNodeHealth,
  fetchPeerData, fetchSyncData
} from '../api/beacon';
import { fetchBeaconNodeVersion, fetchGenesisData, fetchValidatorVersion } from '../api/config';
import { fetchValCaches, fetchValStates } from '../api/validator';
import Wrapper from './Wrapper';


export default async function Page() {
  const beaconSpec = await fetchBeaconSpec()

  const genesisBlock = await fetchGenesisData()
  const peerData = await fetchPeerData()
  const syncData = await fetchSyncData()
  const nodeHealth = await fetchNodeHealth()
  const states = await fetchValStates()
  const caches = await fetchValCaches()
  const inclusion = await fetchInclusionRate()
  const bnVersion = await fetchBeaconNodeVersion()
  const lighthouseVersion = await fetchValidatorVersion()

  return (
    <Wrapper
      initValCaches={caches}
      initValStates={states}
      initNodeHealth={nodeHealth}
      initSyncData={syncData}
      initInclusionRate={inclusion}
      initPeerData={peerData}

      genesisTime={Number(genesisBlock.genesis_time)}
      lighthouseVersion={lighthouseVersion.version}
      bnVersion={bnVersion.version}
      beaconSpec={beaconSpec}
    />
  )
}