import { ArticleCategoryRepo } from '../../articleCategoryRepo';
import { ArticleCategoryModel } from '../../model';
import { SearchArticleCategoriesController } from './searchArticleCategoriesController';
import { SearchArticleCategoriesUseCase } from './searchArticleCategoriesUseCase';

const articleCategoryRepo = new ArticleCategoryRepo(ArticleCategoryModel);
const searchArticleCategoriesUseCase = new SearchArticleCategoriesUseCase(articleCategoryRepo);
export const searchArticleCategoriesController = new SearchArticleCategoriesController(
  searchArticleCategoriesUseCase,
);
