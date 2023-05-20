import jwt from 'jsonwebtoken';
import { authConfig } from '../config';

export const verifyToken = (req, res, next) => {
  const { accessToken } = req.cookies || {};
  console.log(6, accessToken);
  if (!accessToken) {
    return res.status(401).send({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(accessToken, authConfig.accessTokenSecret as string);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send({ message: 'Invalid access token' });
  }
};
