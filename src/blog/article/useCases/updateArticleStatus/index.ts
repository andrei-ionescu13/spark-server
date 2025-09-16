import { ArticleModel } from '../../model';
import { ArticleCommandRepo } from '../../repo/commands';
import { UpdateArticleStatusController } from './updateArticleStatusController';
import { UpdateArticleStatusUseCase } from './updateArticleStatusUseCase';

const articleCommandRepo = new ArticleCommandRepo(ArticleModel);
const updateArticleStatusUseCase = new UpdateArticleStatusUseCase(articleCommandRepo);
export const updateArticleStatusController = new UpdateArticleStatusController(
  updateArticleStatusUseCase,
);
