import axios from 'axios'

export const fetchValidatorGraffiti = async (baseValidatorUrl: string, token: string) =>
  await axios.get(`${baseValidatorUrl}/ui/graffiti`, {
    headers: { Authorization: `Bearer ${token}` },
  })

export const updateValidator = async (
  baseUrl: string,
  pubKey: string,
  token: string,
  data: Record<string, any>,
) =>
  await axios.patch(`${baseUrl}/validators/${pubKey}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })

