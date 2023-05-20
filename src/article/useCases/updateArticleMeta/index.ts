import { ArticleRepo } from '../../articleRepo';
import { ArticleModel } from '../../model';
import { UpdateArticleMetaController } from './updateArticleMetaController';
import { UpdateArticleMetaUseCase } from './updateArticleMetaUseCase';

const articleRepo = new ArticleRepo(ArticleModel);
const updateArticleMetaUseCase = new UpdateArticleMetaUseCase(articleRepo);
export const updateArticleMetaController = new UpdateArticleMetaController(
  updateArticleMetaUseCase,
);
