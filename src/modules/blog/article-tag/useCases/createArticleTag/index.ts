import { Mongo } from '../../../../../mongo';
import { ArticleTagCommandsRepo } from '../../repo/commands';
import { ArticleTagQueriesRepo } from '../../repo/queries';
import { CreateArticleTagController } from './createArticleTagController';
import { CreateArticleTagUseCase } from './createArticleTagUseCase';

const articleTagCommandsRepo = new ArticleTagCommandsRepo(
  Mongo.getCollection('article_categories'),
);
const articleTagQueriesRepo = new ArticleTagQueriesRepo(Mongo.getCollection('article_categories'));
const createArticleTagUseCase = new CreateArticleTagUseCase(
  articleTagCommandsRepo,
  articleTagQueriesRepo,
);
export const createArticleTagController = new CreateArticleTagController(createArticleTagUseCase);
