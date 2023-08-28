import express from 'express';
import type { Request, Response } from 'express';
import multer from 'multer';
import { searchArticlesController } from './useCases/searchArticles';
import { getArticleController } from './useCases/getArticle';
import { updateArticleCategoryController } from './useCases/updateArticleCategory';
import { updateArticleStatusController } from './useCases/updateArticleStatus';
import { updateArticleMetaController } from './useCases/updateArticleMeta';
import { deleteArticleController } from './useCases/deleteArticle';
import { createArticleController } from './useCases/createArticle';
import { deleteArticlesBulkController } from './useCases/deleteArticlesBulk';
import { updateArticleDetailsController } from './useCases/updateArticleDetails';
import { duplicateArticleController } from './useCases/duplicateArticle';
import { updateArticleTagsController } from './useCases/updateArticleTags';
const router = express.Router();

router.get('/', (req: Request, res: Response) => searchArticlesController.execute(req, res));
router.get('/:articleId', (req: Request, res: Response) => getArticleController.execute(req, res));
router.put('/:articleId/category', (req: Request, res: Response) =>
  updateArticleCategoryController.execute(req, res),
);
router.put('/:articleId/status', (req: Request, res: Response) =>
  updateArticleStatusController.execute(req, res),
);

router.put('/:articleId/meta', (req: Request, res: Response) =>
  updateArticleMetaController.execute(req, res),
);

router.put('/:articleId/tags', (req: Request, res: Response) =>
  updateArticleTagsController.execute(req, res),
);

router.delete('/:articleId', (req: Request, res: Response) =>
  deleteArticleController.execute(req, res),
);

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

router.post('/', upload.single('cover'), (req: Request, res: Response) =>
  createArticleController.execute(req, res),
);

router.delete('/', (req: Request, res: Response) => deleteArticlesBulkController.execute(req, res));

router.put('/:articleId/details', upload.single('cover'), (req: Request, res: Response) =>
  updateArticleDetailsController.execute(req, res),
);

router.post('/duplicate/:articleId', (req: Request, res: Response) =>
  duplicateArticleController.execute(req, res),
);

export default router;
