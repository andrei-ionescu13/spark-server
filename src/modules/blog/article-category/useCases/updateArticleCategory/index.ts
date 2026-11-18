import { Mongo } from '../../../../../mongo';
import { ArticleCategoryCommandsRepo } from '../../repo/commands';
import { ArticleCategoryQueriesRepo } from '../../repo/queries';
import { UpdateArticleCategoryController } from './updateArticleCategoryController';
import { UpdateArticleCategoryUseCase } from './updateArticleCategoryUseCase';

const articleCategoryCommandsRepo = new ArticleCategoryCommandsRepo();
const articleCategoryQueriesRepo = new ArticleCategoryQueriesRepo();

const updateArticleCategoryUseCase = new UpdateArticleCategoryUseCase(
  articleCategoryCommandsRepo,
  articleCategoryQueriesRepo,
);

export const updateArticleCategoryController = new UpdateArticleCategoryController(
  updateArticleCategoryUseCase,
);
