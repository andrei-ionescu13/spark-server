import { Mongo } from '../../../../../mongo';
import { ArticleQueriesRepo } from '../../../article/repo/queries';
import { ArticleCategoryCommandsRepo } from '../../repo/commands';
import { ArticleCategoryQueriesRepo } from '../../repo/queries';
import { DeleteArticleCategoryBulkController } from './deleteArticleCategoryBulkController';
import { DeleteArticleCategoryBulkUseCase } from './deleteArticleCategoryBulkUseCase';

const articleQueriesRepo = new ArticleQueriesRepo(Mongo.getCollection('articles'));
const articleCategoryCommandsRepo = new ArticleCategoryCommandsRepo(
  Mongo.getCollection('article_categories'),
);
const articleCategoryQueriesRepo = new ArticleCategoryQueriesRepo(
  Mongo.getCollection('article_categories'),
);

const deleteArticleCategoryBulkUseCase = new DeleteArticleCategoryBulkUseCase(
  articleQueriesRepo,
  articleCategoryCommandsRepo,
  articleCategoryQueriesRepo,
);

export const deleteArticleCategoryBulkController = new DeleteArticleCategoryBulkController(
  deleteArticleCategoryBulkUseCase,
);
