import { ArticleRepo } from '../../../article/articleRepo';
import { ArticleModel } from '../../../article/model';
import { ArticleCategoryRepo } from '../../articleCategoryRepo';
import { ArticleCategoryModel } from '../../model';
import { DeleteArticleCategoryController } from './deleteArticleCategoryController';
import { DeleteArticleCategoryUseCase } from './deleteArticleCategoryUseCase';

const articleRepo = new ArticleRepo(ArticleModel);
const articleCategoryRepo = new ArticleCategoryRepo(ArticleCategoryModel);

const deleteArticleCategoryUseCase = new DeleteArticleCategoryUseCase(
  articleRepo,
  articleCategoryRepo,
);
export const deleteArticleCategoryController = new DeleteArticleCategoryController(
  deleteArticleCategoryUseCase,
);
