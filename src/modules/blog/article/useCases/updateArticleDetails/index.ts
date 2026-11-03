import { Mongo } from '../../../../../mongo';
import { CloudinaryUploaderService } from '../../../../../services/uploaderService';
import { ArticleCommandsRepo } from '../../repo/commands';
import { UpdateArticleDetailsController } from './updateArticleDetailsController';
import { UpdateArticleDetailsUseCase } from './updateArticleDetailsUseCase';

const articleCommandsRepo = new ArticleCommandsRepo(Mongo.getCollection('articles'));
const uploaderService = new CloudinaryUploaderService();
const updateArticleDetailsUseCase = new UpdateArticleDetailsUseCase(
  articleCommandsRepo,
  uploaderService,
);
export const updateArticleDetailsController = new UpdateArticleDetailsController(
  updateArticleDetailsUseCase,
);
