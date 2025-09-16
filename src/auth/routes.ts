import express, { Request, Response } from 'express';
import { getAccessTokenController } from './useCases/getAccessToken';
import { loginController } from './useCases/login';
import { logoutController } from './useCases/logout';
import { registerController } from './useCases/register';
const router = express.Router();

router.post('/signup', (req: Request, res: Response) => registerController.execute(req, res));

router.post('/login', (req: Request, res: Response) => loginController.execute(req, res));

router.get('/access-token', (req: Request, res: Response) =>
  getAccessTokenController.execute(req, res),
);

router.get('/logout', (req: Request, res: Response) => logoutController.execute(req, res));

export default router;
