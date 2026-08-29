import { Mongo } from '../../../../../mongo';
import { ArticleCategoryCommandsRepo } from '../../repo/commands';
import { ArticleCategoryQueriesRepo } from '../../repo/queries';
import { CreateArticleCategoryController } from './createArticleCategoryController';
import { CreateArticleCategoryUseCase } from './createArticleCategoryUseCase';

const articleCategoryCommands = new ArticleCategoryCommandsRepo(
  Mongo.getCollection('article_categories'),
);
const articleCategoryQueries = new ArticleCategoryQueriesRepo(
  Mongo.getCollection('article_categories'),
);

const createArticleCategoryUseCase = new CreateArticleCategoryUseCase(
  articleCategoryCommands,
  articleCategoryQueries,
);

export const createArticleCategoryController = new CreateArticleCategoryController(
  createArticleCategoryUseCase,
);
