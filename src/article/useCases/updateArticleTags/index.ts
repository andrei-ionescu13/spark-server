import { ArticleTagRepo } from '../../../article-tag/articleTagRepo';
import { ArticleTagModel } from '../../../article-tag/model';
import { ArticleRepo } from '../../articleRepo';
import { ArticleModel } from '../../model';
import { UpdateArticleTagsController } from './updateArticleTagsController';
import { UpdateArticleTagsUseCase } from './updateArticleTagsUseCase';

const articleRepo = new ArticleRepo(ArticleModel);
const articleTagRepo = new ArticleTagRepo(ArticleTagModel);

const updateArticleTagsUseCase = new UpdateArticleTagsUseCase(articleRepo, articleTagRepo);
export const updateArticleTagsController = new UpdateArticleTagsController(
  updateArticleTagsUseCase,
);
