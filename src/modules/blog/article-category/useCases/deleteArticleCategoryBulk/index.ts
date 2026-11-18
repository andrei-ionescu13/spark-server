import { Mongo } from '../../../../../mongo';
import { ArticleQueriesRepo } from '../../../article/repo/queries';
import { ArticleCategoryCommandsRepo } from '../../repo/commands';
import { ArticleCategoryQueriesRepo } from '../../repo/queries';
import { DeleteArticleCategoryBulkController } from './deleteArticleCategoryBulkController';
import { DeleteArticleCategoryBulkUseCase } from './deleteArticleCategoryBulkUseCase';

const articleQueriesRepo = new ArticleQueriesRepo();
const articleCategoryCommandsRepo = new ArticleCategoryCommandsRepo();
const articleCategoryQueriesRepo = new ArticleCategoryQueriesRepo();

const deleteArticleCategoryBulkUseCase = new DeleteArticleCategoryBulkUseCase(
  articleQueriesRepo,
  articleCategoryCommandsRepo,
  articleCategoryQueriesRepo,
);

export const deleteArticleCategoryBulkController = new DeleteArticleCategoryBulkController(
  deleteArticleCategoryBulkUseCase,
);
