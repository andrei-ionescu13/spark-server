import { ArticleQueryRepo } from '../../../article/articleRepo';
import { ArticleModel } from '../../../article/model';
import { ArticleCategoryModel } from '../../model';
import { ArticleCategoryCommandRepo } from '../../repo/commands';
import { ArticleCategoryQueryRepo } from '../../repo/queries';
import { DeleteArticleCategoryController } from './deleteArticleCategoryController';
import { DeleteArticleCategoryUseCase } from './deleteArticleCategoryUseCase';

const articleRepo = new ArticleQueryRepo(ArticleModel);
const articleCategoryCommandRepo = new ArticleCategoryCommandRepo(ArticleCategoryModel);
const articleCategoryQueryRepo = new ArticleCategoryQueryRepo(ArticleCategoryModel);

const deleteArticleCategoryUseCase = new DeleteArticleCategoryUseCase(
  articleRepo,
  articleCategoryCommandRepo,
  articleCategoryQueryRepo,
);
export const deleteArticleCategoryController = new DeleteArticleCategoryController(
  deleteArticleCategoryUseCase,
);
