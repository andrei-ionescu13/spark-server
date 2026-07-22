import express, { Request, Response } from 'express';
import { verifyToken } from '../middleware/verify-token';
import { getAccessTokenController } from './useCases/getAccessToken';
import { getUserController } from './useCases/getUser';
import { loginController } from './useCases/login';
import { logoutController } from './useCases/logout';
import { registerController } from './useCases/register';
const router = express.Router();

router.get('/me', verifyToken, (req: Request, res: Response) =>
  getUserController.execute(req, res),
);

router.post('/signup', (req: Request, res: Response) => registerController.execute(req, res));

router.post('/login', (req: Request, res: Response) => loginController.execute(req, res));

router.get('/access-token', (req: Request, res: Response) =>
  getAccessTokenController.execute(req, res),
);

router.get('/logout', (req: Request, res: Response) => logoutController.execute(req, res));

export default router;
