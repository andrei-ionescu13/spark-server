import type { Request, Response } from 'express';
import express from 'express';
import { createOperatingSystemController } from './useCases/createOperatingSystem';
import { deleteOperatingSystemController } from './useCases/deleteOperatingSystem';
import { deleteOperatingSystemBulkController } from './useCases/deleteOperatingSystemBulk';
import { listOperatingSystemsController } from './useCases/listOperatingSystems';
import { searchOperatingSystemController } from './useCases/searchOperatingSystems';
import { updateOperatingSystemController } from './useCases/updateOperatingSystem';
const router = express.Router();

router.get('/search', (req: Request, res: Response) =>
  searchOperatingSystemController.execute(req, res),
);

router.get('/', (req: Request, res: Response) => listOperatingSystemsController.execute(req, res));

router.post('/', (req: Request, res: Response) =>
  createOperatingSystemController.execute(req, res),
);

router.put('/:operatingSystemId', (req: Request, res: Response) =>
  updateOperatingSystemController.execute(req, res),
);

router.delete('/', (req: Request, res: Response) =>
  deleteOperatingSystemBulkController.execute(req, res),
);

router.delete('/:operatingSystemId', (req: Request, res: Response) =>
  deleteOperatingSystemController.execute(req, res),
);

export default router;
