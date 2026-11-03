import { Mongo } from '../../../../../mongo';
import { ArticleTagQueriesRepo } from '../../repo/queries';
import { ListArticleTagsController } from './listArticleTagsController';
import { ListArticleTagsUseCase } from './listArticleTagsUseCase';

const articleTagQueriesRepo = new ArticleTagQueriesRepo(Mongo.getCollection('article_tags'));
const listArticleTagsUseCase = new ListArticleTagsUseCase(articleTagQueriesRepo);
export const listArticleTagsController = new ListArticleTagsController(listArticleTagsUseCase);
