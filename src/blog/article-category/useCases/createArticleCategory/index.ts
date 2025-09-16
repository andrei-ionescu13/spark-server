import { ArticleCategoryModel } from '../../model';
import { ArticleCategoryCommandRepo } from '../../repo/commands';
import { ArticleCategoryQueryRepo } from '../../repo/queries';
import { CreateArticleCategoryController } from './createArticleCategoryController';
import { CreateArticleCategoryUseCase } from './createArticleCategoryUseCase';

const articleCategoryCommand = new ArticleCategoryCommandRepo(ArticleCategoryModel);
const articleCategoryQuery = new ArticleCategoryQueryRepo(ArticleCategoryModel);

const createArticleCategoryUseCase = new CreateArticleCategoryUseCase(
  articleCategoryCommand,
  articleCategoryQuery,
);

export const createArticleCategoryController = new CreateArticleCategoryController(
  createArticleCategoryUseCase,
);
