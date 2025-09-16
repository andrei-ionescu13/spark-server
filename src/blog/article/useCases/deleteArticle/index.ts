import { ArticleModel } from '../../model';
import { ArticleCommandRepo } from '../../repo/commands';
import { DeleteArticleController } from './deleteArticleController';
import { DeleteArticleUseCase } from './deleteArticleUseCase';

const articleRepo = new ArticleCommandRepo(ArticleModel);
const deleteArticleUseCase = new DeleteArticleUseCase(articleRepo);
export const deleteArticleController = new DeleteArticleController(deleteArticleUseCase);
