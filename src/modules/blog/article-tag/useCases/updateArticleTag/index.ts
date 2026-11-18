import { Mongo } from '../../../../../mongo';
import { ArticleTagCommandsRepo } from '../../repo/commands';
import { ArticleTagQueriesRepo } from '../../repo/queries';
import { UpdateArticleTagController } from './updateArticleTagController';
import { UpdateArticleTagUseCase } from './updateArticleTagUseCase';

const articleTagQueriesRepo = new ArticleTagQueriesRepo();
const articleTagCommandsRepo = new ArticleTagCommandsRepo();
const updateArticleTagUseCase = new UpdateArticleTagUseCase(
  articleTagQueriesRepo,
  articleTagCommandsRepo,
);
export const updateArticleTagController = new UpdateArticleTagController(updateArticleTagUseCase);
