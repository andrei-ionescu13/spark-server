import express, { Request, Response } from 'express';
import { addOperatingSystemController } from './useCases/createOperatingSystem';
import { deleteOperatingSystemController } from './useCases/deleteOperatingSystem';
import { deleteOperatingSystemsBulkController } from './useCases/deleteOperatingSystemBulk';
import { listOperatingSystemsController } from './useCases/listOperatingSystems';
import { searchOperatingSystemsController } from './useCases/searchOperatingSystems';
import { updateOperatingSystemController } from './useCases/updateOperatingSystem';
const router = express.Router();

router.get('/search', (req: Request, res: Response) =>
  searchOperatingSystemsController.execute(req, res),
);
router.get('/', (req: Request, res: Response) => listOperatingSystemsController.execute(req, res));
router.post('/', (req: Request, res: Response) => addOperatingSystemController.execute(req, res));
router.delete('/:operatingSystemId', (req: Request, res: Response) =>
  deleteOperatingSystemController.execute(req, res),
);
router.delete('/', (req: Request, res: Response) =>
  deleteOperatingSystemsBulkController.execute(req, res),
);
router.put('/:operatingSystemId', (req: Request, res: Response) =>
  updateOperatingSystemController.execute(req, res),
);

export default router;
