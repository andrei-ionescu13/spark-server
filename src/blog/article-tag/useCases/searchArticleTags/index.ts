import { ArticleTagModel } from '../../model';
import { ArticleTagQueryRepo } from '../../repo/queries';
import { SearchArticleCategoriesController } from './searchArticleTagsController';
import { SearchArticleCategoriesUseCase } from './searchArticleTagsUseCase';

const articleTagQueryRepo = new ArticleTagQueryRepo(ArticleTagModel);
const searchArticleCategoriesUseCase = new SearchArticleCategoriesUseCase(articleTagQueryRepo);
export const searchArticleCategoriesController = new SearchArticleCategoriesController(
  searchArticleCategoriesUseCase,
);
