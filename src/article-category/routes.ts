import express from 'express';
import type { Request, Response } from 'express';
import { createArticleCategoryController } from './useCases/createArticleCategory';
import { updateArticleCategoryController } from './useCases/updateArticleCategory';
import { searchArticleCategoriesController } from './useCases/searchArticleCategories';
import { listArticleCategoriesController } from './useCases/listArticleCategories';
import { deleteArticleCategoryBulkController } from './useCases/deleteArticleCategoryBulk';
const router = express.Router();

router.get('/search', (req: Request, res: Response) =>
  searchArticleCategoriesController.execute(req, res),
);

router.put('/:articleCategoryId', (req: Request, res: Response) =>
  updateArticleCategoryController.execute(req, res),
);

router.get('/', (req: Request, res: Response) => listArticleCategoriesController.execute(req, res));

router.post('/', (req: Request, res: Response) =>
  createArticleCategoryController.execute(req, res),
);

router.delete('/', (req: Request, res: Response) =>
  deleteArticleCategoryBulkController.execute(req, res),
);

export default router;
