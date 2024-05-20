const getReqAuthToken = (req: Request): string => {
  const authHeader = req.headers.get('Authorization');
  if(!authHeader) return ''
  return authHeader.split(' ')[1]
}

export default getReqAuthToken