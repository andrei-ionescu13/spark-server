import { CloudinaryUploaderService } from '../../../services/uploaderService';
import { ArticleRepo } from '../../articleRepo';
import { ArticleModel } from '../../model';
import { UpdateArticleDetailsController } from './updateArticleDetailsController';
import { UpdateArticleDetailsUseCase } from './updateArticleDetailsUseCase';

const articleRepo = new ArticleRepo(ArticleModel);
const uploaderService = new CloudinaryUploaderService();
const updateArticleDetailsUseCase = new UpdateArticleDetailsUseCase(articleRepo, uploaderService);
export const updateArticleDetailsController = new UpdateArticleDetailsController(
  updateArticleDetailsUseCase,
);
