import { Mongo } from '../../../../../mongo';
import { ArticleCommandsRepo } from '../../repo/commands';
import { DeleteArticlesBulkController } from './deleteArticlesBulkController';
import { DeleteArticlesBulkUseCase } from './deleteArticlesBulkUseCase';

const articleCommand = new ArticleCommandsRepo(Mongo.getCollection('articles'));
const deleteArticlesBulkUseCase = new DeleteArticlesBulkUseCase(articleCommand);
export const deleteArticlesBulkController = new DeleteArticlesBulkController(
  deleteArticlesBulkUseCase,
);
