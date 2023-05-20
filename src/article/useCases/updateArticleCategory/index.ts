import { ArticleRepo } from '../../articleRepo';
import { ArticleModel } from '../../model';
import { UpdateArticleCategoryController } from './updateArticleCategoryController';
import { UpdateArticleCategoryUseCase } from './updateArticleCategoryUseCase';

const articleRepo = new ArticleRepo(ArticleModel);
const updateArticleCategoryUseCase = new UpdateArticleCategoryUseCase(articleRepo);
export const updateArticleCategoryController = new UpdateArticleCategoryController(
  updateArticleCategoryUseCase,
);
