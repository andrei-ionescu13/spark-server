import { CloudinaryUploaderService } from '../../../../services/uploaderService';
import { ArticleModel } from '../../model';
import { ArticleCommandRepo } from '../../repo/commands';
import { ArticleQueryRepo } from '../../repo/queries';
import { DuplicateArticleController } from './duplicateArticleController';
import { DuplicateArticleUseCase } from './duplicateArticleUseCase';

const articleCommandRepo = new ArticleCommandRepo(ArticleModel);
const articleQueryRepo = new ArticleQueryRepo(ArticleModel);

const uploaderService = new CloudinaryUploaderService();

const duplicateArticleUseCase = new DuplicateArticleUseCase(
  articleCommandRepo,
  articleQueryRepo,
  uploaderService,
);
export const duplicateArticleController = new DuplicateArticleController(duplicateArticleUseCase);
