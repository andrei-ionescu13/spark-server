import { Mongo } from '../../../../../mongo';
import { ArticleCommandsRepo } from '../../repo/commands';
import { UpdateArticleStatusController } from './updateArticleStatusController';
import { UpdateArticleStatusUseCase } from './updateArticleStatusUseCase';

const articleCommandsRepo = new ArticleCommandsRepo(Mongo.getCollection('articles'));
const updateArticleStatusUseCase = new UpdateArticleStatusUseCase(articleCommandsRepo);
export const updateArticleStatusController = new UpdateArticleStatusController(
  updateArticleStatusUseCase,
);
