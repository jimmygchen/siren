import fetchFromApi from '../../utilities/fetchFromApi';

const backendUrl = process.env.BACKEND_URL;
const secondsInSlot = Number(process.env.SECONDS_IN_SLOT) || 12;
const slotInterval = secondsInSlot - 1;


export const fetchNodeHealth = async () => await fetchFromApi(`${backendUrl}/node/health`, {next: {revalidate: (slotInterval / 2)}})
export const fetchSyncData = async () => await fetchFromApi(`${backendUrl}/beacon/sync`, {next: {revalidate: slotInterval}})
export const fetchInclusionRate = async () => await fetchFromApi(`${backendUrl}/beacon/inclusion`, {next: {revalidate: slotInterval}})
export const fetchPeerData = async () => await fetchFromApi(`${backendUrl}/beacon/peer`, {next: {revalidate: slotInterval}})
export const fetchBeaconSpec = async () => await fetchFromApi(`${backendUrl}/beacon/spec`)
export const fetchValidatorCountData = async () => await fetchFromApi(`${backendUrl}/beacon/validator-count`, {next: {revalidate: 60}})