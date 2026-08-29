import { Mongo } from '../../../../../mongo';
import { ArticleTagQueriesRepo } from '../../repo/queries';
import { SearchArticleCategoriesController } from './searchArticleTagsController';
import { SearchArticleCategoriesUseCase } from './searchArticleTagsUseCase';

const articleTagQueriesRepo = new ArticleTagQueriesRepo(Mongo.getCollection('article_tags'));
const searchArticleCategoriesUseCase = new SearchArticleCategoriesUseCase(articleTagQueriesRepo);
export const searchArticleCategoriesController = new SearchArticleCategoriesController(
  searchArticleCategoriesUseCase,
);
