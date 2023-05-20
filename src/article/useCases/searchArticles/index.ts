import { ArticleRepo } from '../../articleRepo';
import { ArticleModel } from '../../model';
import { SearchArticlesController } from './SearchArticlesController';
import { SearchArticlesUseCase } from './SearchArticlesUseCase';

const articleRepo = new ArticleRepo(ArticleModel);
const searchArticlesUseCase = new SearchArticlesUseCase(articleRepo);
export const searchArticlesController = new SearchArticlesController(searchArticlesUseCase);
