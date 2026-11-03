import jwt from 'jsonwebtoken';
import { authConfig } from '../../config';

export class AuthService {
  generateRefreshToken = (id: string, username: string): string =>
    jwt.sign(
      {
        adminId: id,
        username: username,
        role: 'admin',
      },
      authConfig.refreshTokenSecret as string,
      { expiresIn: '7d' },
    );

  generateAccessToken = (id: string, username: string): string =>
    jwt.sign(
      {
        adminId: id,
        username: username,
        role: 'admin',
      },
      authConfig.accessTokenSecret as string,
      { expiresIn: '1h' },
    );

  decodeRefreshToken = (token): Promise<any> =>
    new Promise((resolve, reject) => {
      jwt.verify(token, authConfig.refreshTokenSecret as string, (err, decoded) => {
        if (err) return resolve(null);
        return resolve(decoded);
      });
    });
}
