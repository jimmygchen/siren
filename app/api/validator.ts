import fetchFromApi from '../../utilities/fetchFromApi'

const backendUrl = process.env.BACKEND_URL
const secondsInSlot = Number(process.env.SECONDS_IN_SLOT) || 12
const slotInterval = secondsInSlot - 1

export const fetchValStates = async (token: string,) =>
  await fetchFromApi(`${backendUrl}/validator/states`, token,{ next: { revalidate: slotInterval } })
export const fetchValCaches = async (token: string,) =>
  await fetchFromApi(`${backendUrl}/validator/caches`, token,{ next: { revalidate: slotInterval } })
export const fetchValMetrics = async (token: string, index?: string) =>
  await fetchFromApi(`${backendUrl}/validator/metrics${index ? `/${index}` : ''}`, token, { cache: 'no-store' })
export const signVoluntaryExit = async (data: any, token: string) =>
  await fetchFromApi(`${backendUrl}/validator/sign-exit`, token,{
    method: 'POST',
    body: JSON.stringify(data)
  })
