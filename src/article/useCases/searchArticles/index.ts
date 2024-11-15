import { ArticleCategoryRepo } from '../../../article-category/articleCategoryRepo';
import { ArticleCategoryModel } from '../../../article-category/model';
import { ArticleRepo } from '../../articleRepo';
import { ArticleModel } from '../../model';
import { SearchArticlesController } from './SearchArticlesController';
import { SearchArticlesUseCase } from './SearchArticlesUseCase';

const articleRepo = new ArticleRepo(ArticleModel);
const articleCategoryRepo = new ArticleCategoryRepo(ArticleCategoryModel);
const searchArticlesUseCase = new SearchArticlesUseCase(articleRepo, articleCategoryRepo);
export const searchArticlesController = new SearchArticlesController(searchArticlesUseCase);
