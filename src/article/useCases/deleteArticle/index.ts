import { ArticleRepo } from '../../articleRepo';
import { ArticleModel } from '../../model';
import { DeleteArticleController } from './deleteArticleController';
import { DeleteArticleUseCase } from './deleteArticleUseCase';

const articleRepo = new ArticleRepo(ArticleModel);
const deleteArticleUseCase = new DeleteArticleUseCase(articleRepo);
export const deleteArticleController = new DeleteArticleController(deleteArticleUseCase);
