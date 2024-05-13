import jwt from 'jsonwebtoken';

const isExpiredToken = (token: string) => {
  const decoded = jwt.decode(token)
  const now = Date.now() / 1000;

  return decoded.exp < now
}

export default isExpiredToken;