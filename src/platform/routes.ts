import express, { Request, Response } from 'express';
import multer from 'multer';
import { createPlatformController } from './useCases/createPlatform/index';
import { deletePlatformController } from './useCases/deletePlatform/index';
import { listPlatformsController } from './useCases/listPlatforms/index';
import { searchPlatformsController } from './useCases/searchPlatforms/index';
import { updatePlatformController } from './useCases/updatePlatform/index';
import { deletePlatformsBulkController } from './useCases/deletePlatformsBulk/index';
const router = express.Router();

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     const name = file.originalname.split('.')[0]
//     cb(null, `${name}-${Date.now()}.${ext}`);
//   },
// });

// const upload = multer({
//   storage: multerStorage,
// });

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (_, file, cb) => {
    const whitelist = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];

    if (!whitelist.includes(file.mimetype)) {
      return cb(new Error('file is not allowed'));
    }

    cb(null, true);
  },
});

router.get('/search', (req: Request, res: Response) => searchPlatformsController.execute(req, res));

router.delete('/:platformId', (req: Request, res: Response) =>
  deletePlatformController.execute(req, res),
);

router.get('/', (req: Request, res: Response) => listPlatformsController.execute(req, res));

router.post('/', upload.single('logo'), (req: Request, res: Response) =>
  createPlatformController.execute(req, res),
);

router.delete('/', (req: Request, res: Response) =>
  deletePlatformsBulkController.execute(req, res),
);

router.put('/:platformId', upload.single('logo'), (req: Request, res: Response) =>
  updatePlatformController.execute(req, res),
);

export default router;
