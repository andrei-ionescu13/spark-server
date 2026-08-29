import { Mongo } from '../../../../../mongo';
import { CloudinaryUploaderService } from '../../../../../services/uploaderService';
import { ArticleCommandsRepo } from '../../repo/commands';
import { ArticleQueriesRepo } from '../../repo/queries';
import { CreateArticleController } from './createArticleController';
import { CreateArticleUseCase } from './createArticleUseCase';

const articleCommandsRepo = new ArticleCommandsRepo(Mongo.getCollection('articles'));
const articleQueriesRepo = new ArticleQueriesRepo(Mongo.getCollection('articles'));

const cloudinaryUploaderService = new CloudinaryUploaderService();

const createArticleUseCase = new CreateArticleUseCase(
  articleCommandsRepo,
  articleQueriesRepo,
  cloudinaryUploaderService,
);
export const createArticleController = new CreateArticleController(createArticleUseCase);
