import express from 'express';
import type { Request, Response } from 'express';
import multer from 'multer';
import { getPublisherController } from './useCases/getPublisher/index';
import { searchPublishersController } from './useCases/searchPublishers/index';
import { createPublisherController } from './useCases/createPublisher/index';
import { deletePublisherController } from './useCases/deletePublisher/index';
import { deletePublishersBulkController } from './useCases/deletePublishersBulk/index';
import { updatePublisherController } from './useCases/updatePublisher/index';
import { listPublishersController } from './useCases/listPublishers';

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

router.get('/', (req: Request, res: Response) => listPublishersController.execute(req, res));

router.get('/search', (req: Request, res: Response) =>
  searchPublishersController.execute(req, res),
);

router.get('/:publisherId', (req: Request, res: Response) =>
  getPublisherController.execute(req, res),
);

router.post('/', upload.single('logo'), (req: Request, res: Response) =>
  createPublisherController.execute(req, res),
);

router.delete('/:publisherId', (req: Request, res: Response) =>
  deletePublisherController.execute(req, res),
);

router.delete('/', (req: Request, res: Response) =>
  deletePublishersBulkController.execute(req, res),
);

router.put('/:publisherId', upload.single('logo'), (req: Request, res: Response) =>
  updatePublisherController.execute(req, res),
);

export default router;
