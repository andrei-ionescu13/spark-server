import { ArticleModel } from '../../../article/model';
import { ArticleCommandRepo } from '../../../article/repo/commands';
import { ArticleTagRepo } from '../../articleTagRepo';
import { ArticleTagModel } from '../../model';
import { DeleteArticleTagBulkController } from './deleteArticleTagBulkController';
import { DeleteArticleTagBulkUseCase } from './deleteArticleTagBulkUseCase';

const articleCommandRepo = new ArticleCommandRepo(ArticleModel);
const articleTagRepo = new ArticleTagRepo(ArticleTagModel);
const deleteArticleTagBulkUseCase = new DeleteArticleTagBulkUseCase(
  articleCommandRepo,
  articleTagRepo,
);
export const deleteArticleTagBulkController = new DeleteArticleTagBulkController(
  deleteArticleTagBulkUseCase,
);
