import { Mongo } from '../../../../../mongo';
import { CloudinaryUploaderService } from '../../../../../services/uploaderService';
import { ArticleCommandsRepo } from '../../repo/commands';
import { ArticleQueriesRepo } from '../../repo/queries';
import { DuplicateArticleController } from './duplicateArticleController';
import { DuplicateArticleUseCase } from './duplicateArticleUseCase';

const articleCommandsRepo = new ArticleCommandsRepo();
const articleQueriesRepo = new ArticleQueriesRepo();

const uploaderService = new CloudinaryUploaderService();

const duplicateArticleUseCase = new DuplicateArticleUseCase(
  articleCommandsRepo,
  articleQueriesRepo,
  uploaderService,
);
export const duplicateArticleController = new DuplicateArticleController(duplicateArticleUseCase);
