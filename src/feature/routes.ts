import express from 'express';
import type { Request, Response } from 'express';
import { createFeatureController } from './useCases/createDeveloper';
import { deleteFeatureController } from './useCases/deleteDeveloper';
import { deleteFeatureBulkController } from './useCases/deleteDeveloperBulk';
import { listFeaturesController } from './useCases/listDevelopers';
import { searchArticleCategoriesController } from './useCases/searchDevelopers';
import { updateFeatureController } from './useCases/updateDeveloper';

const router = express.Router();

router.get('/search', (req: Request, res: Response) =>
  searchArticleCategoriesController.execute(req, res),
);

router.get('/', (req: Request, res: Response) => listFeaturesController.execute(req, res));

router.post('/', (req: Request, res: Response) => createFeatureController.execute(req, res));

router.put('/:featureId', (req: Request, res: Response) =>
  updateFeatureController.execute(req, res),
);

router.delete('/', (req: Request, res: Response) => deleteFeatureBulkController.execute(req, res));

router.delete('/:featureId', (req: Request, res: Response) =>
  deleteFeatureController.execute(req, res),
);

export default router;
