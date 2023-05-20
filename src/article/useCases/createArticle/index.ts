import { CloudinaryUploaderService } from '../../../services/uploaderService';
import { ArticleRepo } from '../../articleRepo';
import { ArticleModel } from '../../model';
import { CreateArticleController } from './createArticleController';
import { CreateArticleUseCase } from './createArticleUseCase';

const articleRepo = new ArticleRepo(ArticleModel);

const cloudinaryUploaderService = new CloudinaryUploaderService();

const createArticleUseCase = new CreateArticleUseCase(articleRepo, cloudinaryUploaderService);
export const createArticleController = new CreateArticleController(createArticleUseCase);
