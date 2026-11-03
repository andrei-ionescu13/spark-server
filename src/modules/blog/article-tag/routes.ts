import express from 'express';
import type { Request, Response } from 'express';
import { createArticleTagController } from './useCases/createArticleTag';
import { updateArticleTagController } from './useCases/updateArticleTag';
import { searchArticleCategoriesController } from './useCases/searchArticleTags';
import { listArticleTagsController } from './useCases/listArticleTags';
import { deleteArticleTagController } from './useCases/deleteArticleTag';
import { deleteArticleTagBulkController } from './useCases/deleteArticleTagBulk';
const router = express.Router();

router.get('/search', (req: Request, res: Response) =>
  searchArticleCategoriesController.execute(req, res),
);

router.get('/', (req: Request, res: Response) => listArticleTagsController.execute(req, res));

router.post('/', (req: Request, res: Response) => createArticleTagController.execute(req, res));

router.put('/:articleTagId', (req: Request, res: Response) =>
  updateArticleTagController.execute(req, res),
);

router.delete('/', (req: Request, res: Response) =>
  deleteArticleTagBulkController.execute(req, res),
);

router.delete('/:articleTagId', (req: Request, res: Response) =>
  deleteArticleTagController.execute(req, res),
);

export default router;
