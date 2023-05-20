import { ArticleRepo } from '../../articleRepo';
import { ArticleModel } from '../../model';
import { DeleteArticlesBulkController } from './deleteArticlesBulkController';
import { DeleteArticlesBulkUseCase } from './deleteArticlesBulkUseCase';

const articleRepo = new ArticleRepo(ArticleModel);
const deleteArticlesBulkUseCase = new DeleteArticlesBulkUseCase(articleRepo);
export const deleteArticlesBulkController = new DeleteArticlesBulkController(
  deleteArticlesBulkUseCase,
);
