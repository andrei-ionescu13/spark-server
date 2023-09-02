import express from 'express';
import type { Request, Response } from 'express';
import { addTranslationsLanguageController } from './useCases/addTranslationsLanguage';
import { deleteTranslationsLanguageController } from './useCases/deleteTranslationsLanguage';
import { listTranslationsLanguagesController } from './useCases/listTranslationsLanguages';
const router = express.Router();

router.post('/', (req: Request, res: Response) =>
  addTranslationsLanguageController.execute(req, res),
);
router.get('/', (req: Request, res: Response) =>
  listTranslationsLanguagesController.execute(req, res),
);
router.delete('/:translationsLanguageId', (req: Request, res: Response) =>
  deleteTranslationsLanguageController.execute(req, res),
);

export default router;
