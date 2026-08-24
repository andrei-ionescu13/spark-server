import { ArticleTagModel } from '../../model';
import { ArticleTagQueryRepo } from '../../repo/queries';
import { ListArticleTagsController } from './listArticleTagsController';
import { ListArticleTagsUseCase } from './listArticleTagsUseCase';

const articleTagQueryRepo = new ArticleTagQueryRepo(ArticleTagModel);
const listArticleTagsUseCase = new ListArticleTagsUseCase(articleTagQueryRepo);
export const listArticleTagsController = new ListArticleTagsController(listArticleTagsUseCase);
