import express, { Request, Response } from 'express';
import multer from 'multer';
import { searchKeysController } from './useCases/searchKeys';
import { createKeyController } from './useCases/createKey';
import { deleteKeyController } from './useCases/deleteKey';
import { deleteKeysBulkController } from './useCases/deleteKeysBulk';
import { importKeysController } from './useCases/importKeys';
import { updateKeysStatusController } from './useCases/updateKeysStatus';
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (_, file, cb) => {
    const whitelist = ['application/json'];

    if (!whitelist.includes(file.mimetype)) {
      return cb(new Error('file is not allowed'));
    }

    cb(null, true);
  },
});

router.get('/', (req: Request, res: Response) => searchKeysController.execute(req, res));
router.post('/', (req: Request, res: Response) => createKeyController.execute(req, res));
router.delete('/:keyId', (req: Request, res: Response) => deleteKeyController.execute(req, res));
router.delete('/', (req: Request, res: Response) => deleteKeysBulkController.execute(req, res));
router.post('/import', upload.single('keys'), (req: Request, res: Response) =>
  importKeysController.execute(req, res),
);
router.put('/:keyId/status', (req: Request, res: Response) =>
  updateKeysStatusController.execute(req, res),
);

export default router;
