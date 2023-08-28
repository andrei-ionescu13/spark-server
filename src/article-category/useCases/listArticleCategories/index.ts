import { ArticleCategoryRepo } from '../../articleCategoryRepo';
import { ArticleCategoryModel } from '../../model';
import { ListArticleCategoriesController } from './listArticleCategoriesController';
import { ListArticleCategoriesUseCase } from './listArticleCategoriesUseCase';

const articleCategoryRepo = new ArticleCategoryRepo(ArticleCategoryModel);
const listArticleCategoriesUseCase = new ListArticleCategoriesUseCase(articleCategoryRepo);
export const listArticleCategoriesController = new ListArticleCategoriesController(
  listArticleCategoriesUseCase,
);
