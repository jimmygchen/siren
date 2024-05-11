import fetchFromApi from '../../utilities/fetchFromApi'

const backendUrl = process.env.BACKEND_URL
const secondsInSlot = Number(process.env.SECONDS_IN_SLOT) || 12
const slotInterval = secondsInSlot - 1

export const fetchNodeHealth = async (token: string) =>
  await fetchFromApi(`${backendUrl}/node/health`, token, { next: { revalidate: slotInterval / 2 } })
export const fetchSyncData = async (token: string) =>
  await fetchFromApi(`${backendUrl}/beacon/sync`, token, { next: { revalidate: slotInterval } })
export const fetchInclusionRate = async (token: string) =>
  await fetchFromApi(`${backendUrl}/beacon/inclusion`, token, { next: { revalidate: slotInterval } })
export const fetchPeerData = async (token: string) =>
  await fetchFromApi(`${backendUrl}/beacon/peer`, token, { next: { revalidate: slotInterval } })
export const fetchBeaconSpec = async (token: string) => await fetchFromApi(`${backendUrl}/beacon/spec`, token)
export const fetchValidatorCountData = async (token: string) =>
  await fetchFromApi(`${backendUrl}/beacon/validator-count`, token, { next: { revalidate: 60 } })
export const fetchProposerDuties = async (token: string) => fetchFromApi(`${backendUrl}/beacon/proposer-duties`, token,{ cache: 'no-store' })
export const broadcastBlsChange = async (data: any, token: string) =>
  await fetchFromApi(`${backendUrl}/beacon/bls-execution`, token, {
    method: 'POST',
    body: JSON.stringify(data)
  })
export const submitSignedExit = async (data: any, token: string) =>
  await fetchFromApi(`${backendUrl}/beacon/execute-exit`, token,{
    method: 'POST',
    body: JSON.stringify(data)
  })
