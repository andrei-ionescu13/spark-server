import type { Request, Response } from 'express';
import express from 'express';
import { createFeatureController } from './useCases/createFeature';
import { deleteFeatureController } from './useCases/deleteFeature';
import { deleteFeatureBulkController } from './useCases/deleteFeatureBulk';
import { listFeaturesController } from './useCases/listFeatures';
import { searchFeatureController } from './useCases/searchFeatures';
import { updateFeatureController } from './useCases/updateFeature';
const router = express.Router();

router.get('/search', (req: Request, res: Response) => searchFeatureController.execute(req, res));

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
