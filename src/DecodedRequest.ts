import { Request } from 'express';

export interface DecodedRequest extends Request {
  user: {
    adminId: string;
    username: string;
    role: string;
  };
  file?: any;
}
