import { ArticleRepo } from '../../../article/articleRepo';
import { ArticleModel } from '../../../article/model';
import { ArticleCategoryRepo } from '../../articleCategoryRepo';
import { ArticleCategoryModel } from '../../model';
import { DeleteArticleCategoryBulkController } from './deleteArticleCategoryBulkController';
import { DeleteArticleCategoryBulkUseCase } from './deleteArticleCategoryBulkUseCase';

const articleRepo = new ArticleRepo(ArticleModel);
const articleCategoryRepo = new ArticleCategoryRepo(ArticleCategoryModel);
const deleteArticleCategoryBulkUseCase = new DeleteArticleCategoryBulkUseCase(
  articleRepo,
  articleCategoryRepo,
);
export const deleteArticleCategoryBulkController = new DeleteArticleCategoryBulkController(
  deleteArticleCategoryBulkUseCase,
);
