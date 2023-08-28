import { ArticleRepo } from '../../../article/articleRepo';
import { ArticleModel } from '../../../article/model';
import { ArticleTagRepo } from '../../articleTagRepo';
import { ArticleTagModel } from '../../model';
import { DeleteArticleTagBulkController } from './deleteArticleTagBulkController';
import { DeleteArticleTagBulkUseCase } from './deleteArticleTagBulkUseCase';

const articleRepo = new ArticleRepo(ArticleModel);
const articleTagRepo = new ArticleTagRepo(ArticleTagModel);
const deleteArticleTagBulkUseCase = new DeleteArticleTagBulkUseCase(articleRepo, articleTagRepo);
export const deleteArticleTagBulkController = new DeleteArticleTagBulkController(
  deleteArticleTagBulkUseCase,
);
