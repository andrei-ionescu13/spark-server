import { Mongo } from '../../../../../mongo';
import { ArticleCategoryQueriesRepo } from '../../../article-category/repo/queries';
import { ArticleQueriesRepo } from '../../repo/queries';
import { SearchArticlesController } from './SearchArticlesController';
import { SearchArticlesUseCase } from './SearchArticlesUseCase';

const articleQueriesRepo = new ArticleQueriesRepo();
const articleCategoryQueriesRepo = new ArticleCategoryQueriesRepo();

const searchArticlesUseCase = new SearchArticlesUseCase(
  articleQueriesRepo,
  articleCategoryQueriesRepo,
);

export const searchArticlesController = new SearchArticlesController(searchArticlesUseCase);
