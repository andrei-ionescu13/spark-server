import { Mongo } from '../../../../../mongo';
import { ArticleCommandsRepo } from '../../repo/commands';
import { DeleteArticleController } from './deleteArticleController';
import { DeleteArticleUseCase } from './deleteArticleUseCase';

const articleRepo = new ArticleCommandsRepo();
const deleteArticleUseCase = new DeleteArticleUseCase(articleRepo);
export const deleteArticleController = new DeleteArticleController(deleteArticleUseCase);
