import { ArticleCategoryModel } from '../../../article-category/model';
import { ArticleCategoryQueryRepo } from '../../../article-category/repo/queries';
import { ArticleModel } from '../../model';
import { ArticleCommandRepo } from '../../repo/commands';
import { UpdateArticleCategoryController } from './updateArticleCategoryController';
import { UpdateArticleCategoryUseCase } from './updateArticleCategoryUseCase';

const articleCommandRepo = new ArticleCommandRepo(ArticleModel);
const articleCategoryQueryRepo = new ArticleCategoryQueryRepo(ArticleCategoryModel);

const updateArticleCategoryUseCase = new UpdateArticleCategoryUseCase(
  articleCommandRepo,
  articleCategoryQueryRepo,
);
export const updateArticleCategoryController = new UpdateArticleCategoryController(
  updateArticleCategoryUseCase,
);
