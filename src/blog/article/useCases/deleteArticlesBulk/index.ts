import { ArticleModel } from '../../model';
import { ArticleCommandRepo } from '../../repo/commands';
import { DeleteArticlesBulkController } from './deleteArticlesBulkController';
import { DeleteArticlesBulkUseCase } from './deleteArticlesBulkUseCase';

const articleCommand = new ArticleCommandRepo(ArticleModel);
const deleteArticlesBulkUseCase = new DeleteArticlesBulkUseCase(articleCommand);
export const deleteArticlesBulkController = new DeleteArticlesBulkController(
  deleteArticlesBulkUseCase,
);
