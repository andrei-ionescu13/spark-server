import { Mongo } from '../../../../../mongo';
import { ArticleTagCommandsRepo } from '../../repo/commands';
import { ArticleTagQueriesRepo } from '../../repo/queries';
import { UpdateArticleTagController } from './updateArticleTagController';
import { UpdateArticleTagUseCase } from './updateArticleTagUseCase';

const articleTagQueriesRepo = new ArticleTagQueriesRepo(Mongo.getCollection('article_tags'));
const articleTagCommandsRepo = new ArticleTagCommandsRepo(Mongo.getCollection('article_tags'));
const updateArticleTagUseCase = new UpdateArticleTagUseCase(
  articleTagQueriesRepo,
  articleTagCommandsRepo,
);
export const updateArticleTagController = new UpdateArticleTagController(updateArticleTagUseCase);
