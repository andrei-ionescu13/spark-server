import { ArticleModel } from '../../../article/model';
import { ArticleQueryRepo } from '../../../article/repo/queries';
import { ArticleCategoryModel } from '../../model';
import { ArticleCategoryCommandRepo } from '../../repo/commands';
import { ArticleCategoryQueryRepo } from '../../repo/queries';
import { DeleteArticleCategoryBulkController } from './deleteArticleCategoryBulkController';
import { DeleteArticleCategoryBulkUseCase } from './deleteArticleCategoryBulkUseCase';

const articleQueryRepo = new ArticleQueryRepo(ArticleModel);
const articleCategoryCommandRepo = new ArticleCategoryCommandRepo(ArticleCategoryModel);
const articleCategoryQueryRepo = new ArticleCategoryQueryRepo(ArticleCategoryModel);

const deleteArticleCategoryBulkUseCase = new DeleteArticleCategoryBulkUseCase(
  articleQueryRepo,
  articleCategoryCommandRepo,
  articleCategoryQueryRepo,
);

export const deleteArticleCategoryBulkController = new DeleteArticleCategoryBulkController(
  deleteArticleCategoryBulkUseCase,
);
