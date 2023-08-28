import express from 'express';
import type { Request, Response } from 'express';
import { createDeveloperController } from './useCases/createDeveloper';
import { updateDeveloperController } from './useCases/updateDeveloper';
import { searchArticleCategoriesController } from './useCases/searchDevelopers';
import { listDevelopersController } from './useCases/listDevelopers';
import { deleteDeveloperController } from './useCases/deleteDeveloper';
import { deleteDeveloperBulkController } from './useCases/deleteDeveloperBulk';
const router = express.Router();

router.get('/search', (req: Request, res: Response) =>
  searchArticleCategoriesController.execute(req, res),
);

router.get('/', (req: Request, res: Response) => listDevelopersController.execute(req, res));

router.post('/', (req: Request, res: Response) => createDeveloperController.execute(req, res));

router.put('/:developerId', (req: Request, res: Response) =>
  updateDeveloperController.execute(req, res),
);

router.delete('/', (req: Request, res: Response) =>
  deleteDeveloperBulkController.execute(req, res),
);

router.delete('/:developerId', (req: Request, res: Response) =>
  deleteDeveloperController.execute(req, res),
);

export default router;
