import { ArticleModel } from '../../../article/model';
import { ArticleCommandRepo } from '../../../article/repo/commands';
import { ArticleTagModel } from '../../model';
import { ArticleTagCommandsRepo } from '../../repo/commands';
import { ArticleTagQueryRepo } from '../../repo/queries';
import { DeleteArticleTagController } from './deleteArticleTagController';
import { DeleteArticleTagUseCase } from './deleteArticleTagUseCase';

const articleCommandRepo = new ArticleCommandRepo(ArticleModel);
const articleTagQueryRepo = new ArticleTagQueryRepo(ArticleTagModel);
const articleTagCommandsRepo = new ArticleTagCommandsRepo(ArticleTagModel);

const deleteArticleTagUseCase = new DeleteArticleTagUseCase(
  articleCommandRepo,
  articleTagQueryRepo,
  articleTagCommandsRepo,
);
export const deleteArticleTagController = new DeleteArticleTagController(deleteArticleTagUseCase);
