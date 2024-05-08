import fetchFromApi from '../../utilities/fetchFromApi';

const backendUrl = process.env.BACKEND_URL
export const fetchLogMetrics = async (token: string) => fetchFromApi(`${backendUrl}/logs/metrics`, token,{ cache: 'no-store' })
export const dismissLogAlert = async (token: string, index: string) => fetchFromApi(`${backendUrl}/logs/dismiss/${index}`, token, { cache: 'no-store' })