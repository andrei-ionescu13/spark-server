import express from 'express';
import type { Request, Response } from 'express';
import { listLanguagesController } from './useCases/listLanguages';
const router = express.Router();

router.get('/', (req: Request, res: Response) => listLanguagesController.execute(req, res));

export default router;
