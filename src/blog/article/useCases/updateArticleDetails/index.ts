import { CloudinaryUploaderService } from '../../../../services/uploaderService';
import { ArticleModel } from '../../model';
import { ArticleCommandRepo } from '../../repo/commands';
import { UpdateArticleDetailsController } from './updateArticleDetailsController';
import { UpdateArticleDetailsUseCase } from './updateArticleDetailsUseCase';

const articleCommandRepo = new ArticleCommandRepo(ArticleModel);
const uploaderService = new CloudinaryUploaderService();
const updateArticleDetailsUseCase = new UpdateArticleDetailsUseCase(
  articleCommandRepo,
  uploaderService,
);
export const updateArticleDetailsController = new UpdateArticleDetailsController(
  updateArticleDetailsUseCase,
);
