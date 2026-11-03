import { Mongo } from '../../../../../mongo';
import { ArticleTagQueriesRepo } from '../../../article-tag/repo/queries';
import { ArticleCommandsRepo } from '../../repo/commands';
import { UpdateArticleTagsController } from './updateArticleTagsController';
import { UpdateArticleTagsUseCase } from './updateArticleTagsUseCase';

const articleCommandsRepo = new ArticleCommandsRepo(Mongo.getCollection('articles'));
const articleTagRepo = new ArticleTagQueriesRepo(Mongo.getCollection('article_tags'));

const updateArticleTagsUseCase = new UpdateArticleTagsUseCase(articleCommandsRepo, articleTagRepo);
export const updateArticleTagsController = new UpdateArticleTagsController(
  updateArticleTagsUseCase,
);
