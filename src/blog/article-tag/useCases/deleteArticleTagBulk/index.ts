import { ArticleModel } from '../../../article/model';
import { ArticleCommandRepo } from '../../../article/repo/commands';
import { ArticleTagModel } from '../../model';
import { ArticleTagCommandsRepo } from '../../repo/commands';
import { ArticleTagQueryRepo } from '../../repo/queries';
import { DeleteArticleTagBulkController } from './deleteArticleTagBulkController';
import { DeleteArticleTagBulkUseCase } from './deleteArticleTagBulkUseCase';

const articleCommandRepo = new ArticleCommandRepo(ArticleModel);
const articleTagQueryRepo = new ArticleTagQueryRepo(ArticleTagModel);
const articleTagCommandsRepo = new ArticleTagCommandsRepo(ArticleTagModel);
const deleteArticleTagBulkUseCase = new DeleteArticleTagBulkUseCase(
  articleCommandRepo,
  articleTagQueryRepo,
  articleTagCommandsRepo,
);
export const deleteArticleTagBulkController = new DeleteArticleTagBulkController(
  deleteArticleTagBulkUseCase,
);
