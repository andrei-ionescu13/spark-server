import { ArticleCategoryModel } from '../../model';
import { ArticleCategoryQueryRepo } from '../../repo/queries';
import { SearchArticleCategoriesController } from './searchArticleCategoriesController';
import { SearchArticleCategoriesUseCase } from './searchArticleCategoriesUseCase';

const articleCategoryQueryRepo = new ArticleCategoryQueryRepo(ArticleCategoryModel);

const searchArticleCategoriesUseCase = new SearchArticleCategoriesUseCase(articleCategoryQueryRepo);

export const searchArticleCategoriesController = new SearchArticleCategoriesController(
  searchArticleCategoriesUseCase,
);
