import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';

export class LogoutController extends BaseController {
  executeImpl = async (req: Request, res: Response) => {
    try {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return this.ok(res, { ok: 'ok' });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
