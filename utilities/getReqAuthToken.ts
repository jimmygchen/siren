const getReqAuthToken = (req: Request) => {
  const authHeader = req.headers.get('Authorization');
  return authHeader.split(' ')[1]
}

export default getReqAuthToken