import { ArticleRepo } from '../../articleRepo';
import { ArticleModel } from '../../model';
import { GetArticleController } from './GetArticleController';
import { GetArticleUseCase } from './GetArticleUseCase';

const articleRepo = new ArticleRepo(ArticleModel);
const getArticleUseCase = new GetArticleUseCase(articleRepo);
export const getArticleController = new GetArticleController(getArticleUseCase);
