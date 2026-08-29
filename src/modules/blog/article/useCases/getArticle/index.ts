import { Mongo } from '../../../../../mongo';
import { ArticleQueriesRepo } from '../../repo/queries';
import { GetArticleController } from './GetArticleController';
import { GetArticleUseCase } from './GetArticleUseCase';

const articleQueriesRepo = new ArticleQueriesRepo(Mongo.getCollection('articles'));
const getArticleUseCase = new GetArticleUseCase(articleQueriesRepo);
export const getArticleController = new GetArticleController(getArticleUseCase);
