import { ArticleCategoryRepo } from '../../../article-category/articleCategoryRepo';
import { ArticleCategoryModel } from '../../../article-category/model';
import { ArticleRepo } from '../../articleRepo';
import { ArticleModel } from '../../model';
import { UpdateArticleCategoryController } from './updateArticleCategoryController';
import { UpdateArticleCategoryUseCase } from './updateArticleCategoryUseCase';

const articleRepo = new ArticleRepo(ArticleModel);
const articleCategoryRepo = new ArticleCategoryRepo(ArticleCategoryModel);

const updateArticleCategoryUseCase = new UpdateArticleCategoryUseCase(
  articleRepo,
  articleCategoryRepo,
);
export const updateArticleCategoryController = new UpdateArticleCategoryController(
  updateArticleCategoryUseCase,
);
