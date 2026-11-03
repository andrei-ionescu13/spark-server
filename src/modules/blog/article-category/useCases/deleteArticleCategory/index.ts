import { Mongo } from '../../../../../mongo';
import { ArticleQueriesRepo } from '../../../article/repo/queries';
import { ArticleCategoryCommandsRepo } from '../../repo/commands';
import { ArticleCategoryQueriesRepo } from '../../repo/queries';
import { DeleteArticleCategoryController } from './deleteArticleCategoryController';
import { DeleteArticleCategoryUseCase } from './deleteArticleCategoryUseCase';

const articleRepo = new ArticleQueriesRepo(Mongo.getCollection('articles'));
const articleCategoryCommandsRepo = new ArticleCategoryCommandsRepo(
  Mongo.getCollection('article_categories'),
);
const articleCategoryQueriesRepo = new ArticleCategoryQueriesRepo(
  Mongo.getCollection('article_categories'),
);

const deleteArticleCategoryUseCase = new DeleteArticleCategoryUseCase(
  articleRepo,
  articleCategoryCommandsRepo,
  articleCategoryQueriesRepo,
);
export const deleteArticleCategoryController = new DeleteArticleCategoryController(
  deleteArticleCategoryUseCase,
);
