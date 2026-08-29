import { Mongo } from '../../../../../mongo';
import { ArticleCommandsRepo } from '../../../article/repo/commands';
import { ArticleTagCommandsRepo } from '../../repo/commands';
import { ArticleTagQueriesRepo } from '../../repo/queries';
import { DeleteArticleTagController } from './deleteArticleTagController';
import { DeleteArticleTagUseCase } from './deleteArticleTagUseCase';

const articleCommandsRepo = new ArticleCommandsRepo(Mongo.getCollection('articles'));
const articleTagQueriesRepo = new ArticleTagQueriesRepo(Mongo.getCollection('article_tags'));
const articleTagCommandsRepo = new ArticleTagCommandsRepo(Mongo.getCollection('article_tags'));

const deleteArticleTagUseCase = new DeleteArticleTagUseCase(
  articleCommandsRepo,
  articleTagQueriesRepo,
  articleTagCommandsRepo,
);
export const deleteArticleTagController = new DeleteArticleTagController(deleteArticleTagUseCase);
