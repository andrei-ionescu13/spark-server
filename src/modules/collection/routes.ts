import express, { Request, Response } from 'express';
import multer from 'multer';
import { searchCollectionsController } from './useCases/searchCollections';
import { getCollectionController } from './useCases/getCollection';
import { createCollectionController } from './useCases/createCollection';
import { deactivateCollectionController } from './useCases/deactivateCollection';
import { deleteCollectionController } from './useCases/deleteCollection';
import { deleteCollectionsBulkController } from './useCases/deleteCollectionsBulk';
import { updateCollectionController } from './useCases/updateCollection';
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

router.get('/search', (req: Request, res: Response) =>
  searchCollectionsController.execute(req, res),
);
router.get('/:collectionId', (req: Request, res: Response) =>
  getCollectionController.execute(req, res),
);

router.post('/', upload.single('cover'), (req: Request, res: Response) =>
  createCollectionController.execute(req, res),
);

router.put('/:collectionId/deactivate', (req: Request, res: Response) =>
  deactivateCollectionController.execute(req, res),
);

router.put('/:collectionId', upload.single('cover'), (req: Request, res: Response) =>
  updateCollectionController.execute(req, res),
);

router.delete('/:collectionId', (req: Request, res: Response) =>
  deleteCollectionController.execute(req, res),
);
router.delete('/', (req: Request, res: Response) =>
  deleteCollectionsBulkController.execute(req, res),
);

// router.post('/duplicate/:id', collectionController.duplicateCollection)
// router.put('/:id/meta', collectionController.updateCollectionMeta)
// router.put('/:id/details', upload.single('coverImage'), collectionController.updateCollectionDetails)
// router.put('/:id/status', collectionController.updateCollectionStatus)
// router.put('/:id/category', collectionController.updateCollectionCategory)

export default router;
