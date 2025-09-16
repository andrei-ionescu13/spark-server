import { ArticleCategoryModel } from '../../model';
import { ArticleCategoryQueryRepo } from '../../repo/queries';
import { ListArticleCategoriesController } from './listArticleCategoriesController';
import { ListArticleCategoriesUseCase } from './listArticleCategoriesUseCase';

const articleCategoryQueryRepo = new ArticleCategoryQueryRepo(ArticleCategoryModel);

const listArticleCategoriesUseCase = new ListArticleCategoriesUseCase(articleCategoryQueryRepo);

export const listArticleCategoriesController = new ListArticleCategoriesController(
  listArticleCategoriesUseCase,
);
