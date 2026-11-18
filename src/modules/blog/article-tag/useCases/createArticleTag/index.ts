import { Mongo } from '../../../../../mongo';
import { ArticleTagCommandsRepo } from '../../repo/commands';
import { ArticleTagQueriesRepo } from '../../repo/queries';
import { CreateArticleTagController } from './createArticleTagController';
import { CreateArticleTagUseCase } from './createArticleTagUseCase';

const articleTagCommandsRepo = new ArticleTagCommandsRepo();
const articleTagQueriesRepo = new ArticleTagQueriesRepo();
const createArticleTagUseCase = new CreateArticleTagUseCase(
  articleTagCommandsRepo,
  articleTagQueriesRepo,
);
export const createArticleTagController = new CreateArticleTagController(createArticleTagUseCase);
