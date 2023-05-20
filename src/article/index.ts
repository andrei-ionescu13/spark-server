import { ArticleRepo } from './articleRepo';
import { ArticleModel } from './model';
export { articleController } from './controller';
export { articleServices } from './services';
export { default as articlesRoutes } from './routes';

export const articleDb = new ArticleRepo(ArticleModel);
