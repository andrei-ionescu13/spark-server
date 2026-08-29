import jwt from 'jsonwebtoken';
import { authConfig } from '../config';

export const verifyToken = (req, res, next) => {
  console.log(req.cookies, 132123);
  const { accessToken } = req.cookies || {};
  if (!accessToken) {
    return res.status(401).send({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(accessToken, authConfig.accessTokenSecret as string);
    console.log(decoded);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send({ message: 'Invalid access token' });
  }
};
