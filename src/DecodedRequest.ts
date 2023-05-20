import { Request } from 'express';

export interface DecodedRequest extends Request {
  user: string;
  file?: any;
}
