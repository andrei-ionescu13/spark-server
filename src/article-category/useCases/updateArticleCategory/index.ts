import { ArticleCategoryRepo } from '../../articleCategoryRepo';
import { ArticleCategoryModel } from '../../model';
import { UpdateArticleCategoryController } from './updateArticleCategoryController';
import { UpdateArticleCategoryUseCase } from './updateArticleCategoryUseCase';

const articleCategoryRepo = new ArticleCategoryRepo(ArticleCategoryModel);
const updateArticleCategoryUseCase = new UpdateArticleCategoryUseCase(articleCategoryRepo);
export const updateArticleCategoryController = new UpdateArticleCategoryController(
  updateArticleCategoryUseCase,
);
