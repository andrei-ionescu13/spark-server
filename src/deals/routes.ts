import express, { Request, Response } from 'express';
import multer from 'multer';
import { createDealController } from './useCases/createDeal';
import { deactivateDealController } from './useCases/deactivateDeal';
import { deleteDealController } from './useCases/deleteDeal';
import { deleteDealsBulkController } from './useCases/deleteDealsBulk';
import { getDealController } from './useCases/getDeal';
import { searchDealsController } from './useCases/searchDeals';
import { updateDealController } from './useCases/updateDeal';

const router = express.Router();
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (_, file, cb) => {
    const whitelist = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

    if (!whitelist.includes(file.mimetype)) {
      return cb(new Error('file is not allowed'));
    }

    cb(null, true);
  },
});

router.get('/search', (req: Request, res: Response) => searchDealsController.execute(req, res));

router.get('/:dealId', (req: Request, res: Response) => getDealController.execute(req, res));

router.post('/', upload.single('cover'), (req: Request, res: Response) =>
  createDealController.execute(req, res),
);

router.put('/:dealId/deactivate', (req: Request, res: Response) =>
  deactivateDealController.execute(req, res),
);

router.put('/:dealId', upload.single('cover'), (req: Request, res: Response) =>
  updateDealController.execute(req, res),
);

router.delete('/:dealId', (req: Request, res: Response) => deleteDealController.execute(req, res));
router.delete('/', (req: Request, res: Response) => deleteDealsBulkController.execute(req, res));

export default router;
