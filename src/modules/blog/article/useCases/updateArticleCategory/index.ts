import { Mongo } from '../../../../../mongo';
import { ArticleCategoryQueriesRepo } from '../../../article-category/repo/queries';
import { ArticleCommandsRepo } from '../../repo/commands';
import { UpdateArticleCategoryController } from './updateArticleCategoryController';
import { UpdateArticleCategoryUseCase } from './updateArticleCategoryUseCase';

const articleCommandsRepo = new ArticleCommandsRepo();
const articleCategoryQueriesRepo = new ArticleCategoryQueriesRepo();

const updateArticleCategoryUseCase = new UpdateArticleCategoryUseCase(
  articleCommandsRepo,
  articleCategoryQueriesRepo,
);
export const updateArticleCategoryController = new UpdateArticleCategoryController(
  updateArticleCategoryUseCase,
);
