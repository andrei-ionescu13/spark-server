import { CloudinaryUploaderService } from '../../../../services/uploaderService';
import { ArticleModel } from '../../model';
import { ArticleCommandRepo } from '../../repo/commands';
import { ArticleQueryRepo } from '../../repo/queries';
import { CreateArticleController } from './createArticleController';
import { CreateArticleUseCase } from './createArticleUseCase';

const articleCommandRepo = new ArticleCommandRepo(ArticleModel);
const articleQueryRepo = new ArticleQueryRepo(ArticleModel);

const cloudinaryUploaderService = new CloudinaryUploaderService();

const createArticleUseCase = new CreateArticleUseCase(
  articleCommandRepo,
  articleQueryRepo,
  cloudinaryUploaderService,
);
export const createArticleController = new CreateArticleController(createArticleUseCase);
