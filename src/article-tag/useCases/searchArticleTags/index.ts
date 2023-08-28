import { ArticleTagRepo } from '../../articleTagRepo';
import { ArticleTagModel } from '../../model';
import { SearchArticleCategoriesController } from './searchArticleTagsController';
import { SearchArticleCategoriesUseCase } from './searchArticleTagsUseCase';

const articleTagRepo = new ArticleTagRepo(ArticleTagModel);
const searchArticleCategoriesUseCase = new SearchArticleCategoriesUseCase(articleTagRepo);
export const searchArticleCategoriesController = new SearchArticleCategoriesController(
  searchArticleCategoriesUseCase,
);
