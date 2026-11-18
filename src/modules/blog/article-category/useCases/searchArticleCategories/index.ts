import { Mongo } from '../../../../../mongo';
import { ArticleCategoryQueriesRepo } from '../../repo/queries';
import { SearchArticleCategoriesController } from './searchArticleCategoriesController';
import { SearchArticleCategoriesUseCase } from './searchArticleCategoriesUseCase';

const articleCategoryQueriesRepo = new ArticleCategoryQueriesRepo();

const searchArticleCategoriesUseCase = new SearchArticleCategoriesUseCase(
  articleCategoryQueriesRepo,
);

export const searchArticleCategoriesController = new SearchArticleCategoriesController(
  searchArticleCategoriesUseCase,
);
