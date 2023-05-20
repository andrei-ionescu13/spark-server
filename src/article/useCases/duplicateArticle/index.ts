import { CloudinaryUploaderService } from '../../../services/uploaderService';
import { ArticleRepo } from '../../articleRepo';
import { ArticleModel } from '../../model';
import { DuplicateArticleUseCase } from './duplicateArticleUseCase';
import { DuplicateArticleController } from './duplicateArticleController';

const articleRepo = new ArticleRepo(ArticleModel);

const uploaderService = new CloudinaryUploaderService();

const duplicateArticleUseCase = new DuplicateArticleUseCase(articleRepo, uploaderService);
export const duplicateArticleController = new DuplicateArticleController(duplicateArticleUseCase);
