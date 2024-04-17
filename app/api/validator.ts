import fetchFromApi from '../../utilities/fetchFromApi';

const backendUrl = process.env.BACKEND_URL;
const secondsInSlot = Number(process.env.SECONDS_IN_SLOT) || 12;
const slotInterval = secondsInSlot - 1;

export const fetchValStates = async () => await fetchFromApi(`${backendUrl}/validator/states`, {next: {revalidate: slotInterval}})
export const fetchValCaches = async () => await fetchFromApi(`${backendUrl}/validator/caches`,  {next: {revalidate: slotInterval}})
export const fetchValMetrics = async () => await fetchFromApi(`${backendUrl}/validator/metrics`, {cache: 'no-store'})