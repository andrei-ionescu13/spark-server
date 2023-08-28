import { ArticleCategoryRepo } from '../../articleCategoryRepo';
import { ArticleCategoryModel } from '../../model';
import { CreateArticleCategoryController } from './createArticleCategoryController';
import { CreateArticleCategoryUseCase } from './createArticleCategoryUseCase';

const articleCategoryRepo = new ArticleCategoryRepo(ArticleCategoryModel);
const createArticleCategoryUseCase = new CreateArticleCategoryUseCase(articleCategoryRepo);
export const createArticleCategoryController = new CreateArticleCategoryController(
  createArticleCategoryUseCase,
);
