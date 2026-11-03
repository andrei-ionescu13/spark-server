import { Mongo } from '../../../../../mongo';
import { ArticleCategoryCommandsRepo } from '../../repo/commands';
import { ArticleCategoryQueriesRepo } from '../../repo/queries';
import { UpdateArticleCategoryController } from './updateArticleCategoryController';
import { UpdateArticleCategoryUseCase } from './updateArticleCategoryUseCase';

const articleCategoryCommandsRepo = new ArticleCategoryCommandsRepo(
  Mongo.getCollection('article_categories'),
);
const articleCategoryQueriesRepo = new ArticleCategoryQueriesRepo(
  Mongo.getCollection('article_categories'),
);

const updateArticleCategoryUseCase = new UpdateArticleCategoryUseCase(
  articleCategoryCommandsRepo,
  articleCategoryQueriesRepo,
);

export const updateArticleCategoryController = new UpdateArticleCategoryController(
  updateArticleCategoryUseCase,
);
