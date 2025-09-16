import { ArticleCategoryModel } from '../../model';
import { ArticleCategoryCommandRepo } from '../../repo/commands';
import { ArticleCategoryQueryRepo } from '../../repo/queries';
import { UpdateArticleCategoryController } from './updateArticleCategoryController';
import { UpdateArticleCategoryUseCase } from './updateArticleCategoryUseCase';

const articleCategoryCommandRepo = new ArticleCategoryCommandRepo(ArticleCategoryModel);
const articleCategoryQueryRepo = new ArticleCategoryQueryRepo(ArticleCategoryModel);

const updateArticleCategoryUseCase = new UpdateArticleCategoryUseCase(
  articleCategoryCommandRepo,
  articleCategoryQueryRepo,
);

export const updateArticleCategoryController = new UpdateArticleCategoryController(
  updateArticleCategoryUseCase,
);
