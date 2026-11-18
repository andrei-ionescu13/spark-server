import { Mongo } from '../../../../../mongo';
import { ArticleCommandsRepo } from '../../../article/repo/commands';
import { ArticleTagCommandsRepo } from '../../repo/commands';
import { ArticleTagQueriesRepo } from '../../repo/queries';
import { DeleteArticleTagController } from './deleteArticleTagController';
import { DeleteArticleTagUseCase } from './deleteArticleTagUseCase';

const articleCommandsRepo = new ArticleCommandsRepo();
const articleTagQueriesRepo = new ArticleTagQueriesRepo();
const articleTagCommandsRepo = new ArticleTagCommandsRepo();

const deleteArticleTagUseCase = new DeleteArticleTagUseCase(
  articleCommandsRepo,
  articleTagQueriesRepo,
  articleTagCommandsRepo,
);
export const deleteArticleTagController = new DeleteArticleTagController(deleteArticleTagUseCase);
