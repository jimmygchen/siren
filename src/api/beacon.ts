import axios from 'axios'

export const broadcastBlsChange = async (baseUrl: string, data: any) =>
  await axios.post(`${baseUrl}/eth/v1/beacon/pool/bls_to_execution_changes`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

export const submitSignedExit = async (baseUrl: string, data: any) =>
  await axios.post(`${baseUrl}/eth/v1/beacon/pool/voluntary_exits`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
