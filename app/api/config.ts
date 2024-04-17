import fetchFromApi from '../../utilities/fetchFromApi';

const backendUrl = process.env.BACKEND_URL;

export const fetchBeaconNodeVersion = async () => await fetchFromApi(`${backendUrl}/beacon/node-version`, {cache: 'no-store'})
export const fetchValidatorAuthKey = async () => await fetchFromApi(`${backendUrl}/validator/auth-key`, {cache: 'no-store'})
export const fetchValidatorVersion = async () => await fetchFromApi(`${backendUrl}/validator/version`, { cache: 'no-store' })
export const fetchGenesisData = async () => await fetchFromApi(`${backendUrl}/beacon/genesis`)