import { ArticleModel } from '../../model';
import { ArticleQueryRepo } from '../../repo/queries';
import { GetArticleController } from './GetArticleController';
import { GetArticleUseCase } from './GetArticleUseCase';

const articleQueryRepo = new ArticleQueryRepo(ArticleModel);
const getArticleUseCase = new GetArticleUseCase(articleQueryRepo);
export const getArticleController = new GetArticleController(getArticleUseCase);
