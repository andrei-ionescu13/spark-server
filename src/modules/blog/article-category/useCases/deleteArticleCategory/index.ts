import { Mongo } from '../../../../../mongo';
import { ArticleQueriesRepo } from '../../../article/repo/queries';
import { ArticleCategoryCommandsRepo } from '../../repo/commands';
import { ArticleCategoryQueriesRepo } from '../../repo/queries';
import { DeleteArticleCategoryController } from './deleteArticleCategoryController';
import { DeleteArticleCategoryUseCase } from './deleteArticleCategoryUseCase';

const articleRepo = new ArticleQueriesRepo();
const articleCategoryCommandsRepo = new ArticleCategoryCommandsRepo();
const articleCategoryQueriesRepo = new ArticleCategoryQueriesRepo();

const deleteArticleCategoryUseCase = new DeleteArticleCategoryUseCase(
  articleRepo,
  articleCategoryCommandsRepo,
  articleCategoryQueriesRepo,
);
export const deleteArticleCategoryController = new DeleteArticleCategoryController(
  deleteArticleCategoryUseCase,
);
