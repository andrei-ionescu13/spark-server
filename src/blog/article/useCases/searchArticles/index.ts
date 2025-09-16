import { ArticleCategoryModel } from '../../../article-category/model';
import { ArticleCategoryQueryRepo } from '../../../article-category/repo/queries';
import { ArticleModel } from '../../model';
import { ArticleQueryRepo } from '../../repo/queries';
import { SearchArticlesController } from './SearchArticlesController';
import { SearchArticlesUseCase } from './SearchArticlesUseCase';

const articleQueryRepo = new ArticleQueryRepo(ArticleModel);
const articleCategoryQueryRepo = new ArticleCategoryQueryRepo(ArticleCategoryModel);

const searchArticlesUseCase = new SearchArticlesUseCase(articleQueryRepo, articleCategoryQueryRepo);

export const searchArticlesController = new SearchArticlesController(searchArticlesUseCase);
