import { Mongo } from '../../../../../mongo';
import { ArticleCategoryQueriesRepo } from '../../repo/queries';
import { ListArticleCategoriesController } from './listArticleCategoriesController';
import { ListArticleCategoriesUseCase } from './listArticleCategoriesUseCase';

const articleCategoryQueriesRepo = new ArticleCategoryQueriesRepo(
  Mongo.getCollection('article_categories'),
);

const listArticleCategoriesUseCase = new ListArticleCategoriesUseCase(articleCategoryQueriesRepo);

export const listArticleCategoriesController = new ListArticleCategoriesController(
  listArticleCategoriesUseCase,
);
