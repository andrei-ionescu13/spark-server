import express from 'express';
import type { Request, Response } from 'express';
import { addLanguageController } from './useCases/addLanguage';
import { deleteLanguageController } from './useCases/deleteLanguage';
import { listLanguagesController } from './useCases/listLanguages';
const router = express.Router();

router.post('/', (req: Request, res: Response) => addLanguageController.execute(req, res));
router.get('/', (req: Request, res: Response) => listLanguagesController.execute(req, res));
router.delete('/:languageId', (req: Request, res: Response) =>
  deleteLanguageController.execute(req, res),
);

export default router;
