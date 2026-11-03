import type { Request, Response } from 'express';
import express from 'express';
import multer from 'multer';
import { createDeveloperController } from './useCases/createDeveloper/index';
import { deleteDeveloperController } from './useCases/deleteDeveloper/index';
import { deleteDevelopersBulkController } from './useCases/deleteDevelopersBulk/index';
import { getDeveloperController } from './useCases/getDeveloper/index';
import { listDevelopersController } from './useCases/listDevelopers';
import { searchDevelopersController } from './useCases/searchDevelopers/index';
import { updateDeveloperController } from './useCases/updateDeveloper/index';

const router = express.Router();

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

router.get('/', (req: Request, res: Response) => listDevelopersController.execute(req, res));

router.get('/search', (req: Request, res: Response) =>
  searchDevelopersController.execute(req, res),
);

router.get('/:developerId', (req: Request, res: Response) =>
  getDeveloperController.execute(req, res),
);

router.post('/', upload.single('logo'), (req: Request, res: Response) =>
  createDeveloperController.execute(req, res),
);

router.delete('/:developerId', (req: Request, res: Response) =>
  deleteDeveloperController.execute(req, res),
);

router.delete('/', (req: Request, res: Response) =>
  deleteDevelopersBulkController.execute(req, res),
);

router.put('/:developerId', upload.single('logo'), (req: Request, res: Response) =>
  updateDeveloperController.execute(req, res),
);

export default router;
