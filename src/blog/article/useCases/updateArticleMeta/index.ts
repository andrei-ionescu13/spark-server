import { ArticleModel } from '../../model';
import { ArticleCommandRepo } from '../../repo/commands';
import { UpdateArticleMetaController } from './updateArticleMetaController';
import { UpdateArticleMetaUseCase } from './updateArticleMetaUseCase';

const articleCommandRepo = new ArticleCommandRepo(ArticleModel);
const updateArticleMetaUseCase = new UpdateArticleMetaUseCase(articleCommandRepo);
export const updateArticleMetaController = new UpdateArticleMetaController(
  updateArticleMetaUseCase,
);
