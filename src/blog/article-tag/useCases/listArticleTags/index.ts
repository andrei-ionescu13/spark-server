import { ArticleTagRepo } from '../../articleTagRepo';
import { ArticleTagModel } from '../../model';
import { ListArticleTagsController } from './listArticleTagsController';
import { ListArticleTagsUseCase } from './listArticleTagsUseCase';

const articleTagRepo = new ArticleTagRepo(ArticleTagModel);
const listArticleTagsUseCase = new ListArticleTagsUseCase(articleTagRepo);
export const listArticleTagsController = new ListArticleTagsController(listArticleTagsUseCase);
