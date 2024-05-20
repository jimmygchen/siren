import axios from 'axios'

const swrGetFetcher = ([url, token]: [string, string]) => axios.get(url, {
  headers: {
    Authorization: `Bearer ${token}`
  }
}).then((res) => res.data)

export default swrGetFetcher
