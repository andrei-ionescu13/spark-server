import type { Request, Response } from 'express';
import express from 'express';
import { createLanguageController } from './useCases/createLanguage';
import { deleteLanguageController } from './useCases/deleteLanguage';
import { deleteLanguagesBulkController } from './useCases/deleteLanguagesBulk';
import { listLanguagesController } from './useCases/listLanguages';
import { searchLanguagesController } from './useCases/searchLanguages';

const router = express.Router();

router.get('/', (req: Request, res: Response) => listLanguagesController.execute(req, res));

router.post('/', (req: Request, res: Response) => createLanguageController.execute(req, res));

router.get('/search', (req: Request, res: Response) => searchLanguagesController.execute(req, res));

router.delete('/:translationsLanguageId', (req: Request, res: Response) =>
  deleteLanguageController.execute(req, res),
);

router.delete('/', (req: Request, res: Response) =>
  deleteLanguagesBulkController.execute(req, res),
);

export default router;
