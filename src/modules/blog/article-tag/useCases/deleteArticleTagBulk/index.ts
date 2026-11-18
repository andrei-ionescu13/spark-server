import { Mongo } from '../../../../../mongo';
import { ArticleCommandsRepo } from '../../../article/repo/commands';
import { ArticleTagCommandsRepo } from '../../repo/commands';
import { ArticleTagQueriesRepo } from '../../repo/queries';
import { DeleteArticleTagBulkController } from './deleteArticleTagBulkController';
import { DeleteArticleTagBulkUseCase } from './deleteArticleTagBulkUseCase';

const articleCommandsRepo = new ArticleCommandsRepo();
const articleTagQueriesRepo = new ArticleTagQueriesRepo();
const articleTagCommandsRepo = new ArticleTagCommandsRepo();
const deleteArticleTagBulkUseCase = new DeleteArticleTagBulkUseCase(
  articleCommandsRepo,
  articleTagQueriesRepo,
  articleTagCommandsRepo,
);
export const deleteArticleTagBulkController = new DeleteArticleTagBulkController(
  deleteArticleTagBulkUseCase,
);
