import { Mongo } from '../../../../../mongo';
import { ArticleCommandsRepo } from '../../repo/commands';
import { UpdateArticleMetaController } from './updateArticleMetaController';
import { UpdateArticleMetaUseCase } from './updateArticleMetaUseCase';

const articleCommandsRepo = new ArticleCommandsRepo(Mongo.getCollection('articles'));
const updateArticleMetaUseCase = new UpdateArticleMetaUseCase(articleCommandsRepo);
export const updateArticleMetaController = new UpdateArticleMetaController(
  updateArticleMetaUseCase,
);
