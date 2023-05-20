import { ArticleRepo } from '../../articleRepo';
import { ArticleModel } from '../../model';
import { UpdateArticleStatusController } from './updateArticleStatusController';
import { UpdateArticleStatusUseCase } from './updateArticleStatusUseCase';

const articleRepo = new ArticleRepo(ArticleModel);
const updateArticleStatusUseCase = new UpdateArticleStatusUseCase(articleRepo);
export const updateArticleStatusController = new UpdateArticleStatusController(
  updateArticleStatusUseCase,
);
