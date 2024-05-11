import axios from 'axios'


export const submitSignedExit = async (baseUrl: string, data: any) =>
  await axios.post(`${baseUrl}/eth/v1/beacon/pool/voluntary_exits`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
