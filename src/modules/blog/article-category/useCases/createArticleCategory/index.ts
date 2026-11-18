import { Mongo } from '../../../../../mongo';
import { ArticleCategoryCommandsRepo } from '../../repo/commands';
import { ArticleCategoryQueriesRepo } from '../../repo/queries';
import { CreateArticleCategoryController } from './createArticleCategoryController';
import { CreateArticleCategoryUseCase } from './createArticleCategoryUseCase';

const articleCategoryCommands = new ArticleCategoryCommandsRepo();
const articleCategoryQueries = new ArticleCategoryQueriesRepo();

const createArticleCategoryUseCase = new CreateArticleCategoryUseCase(
  articleCategoryCommands,
  articleCategoryQueries,
);

export const createArticleCategoryController = new CreateArticleCategoryController(
  createArticleCategoryUseCase,
);
