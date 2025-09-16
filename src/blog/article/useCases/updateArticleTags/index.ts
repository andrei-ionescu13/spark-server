import { ArticleTagRepo } from '../../../article-tag/articleTagRepo';
import { ArticleTagModel } from '../../../article-tag/model';
import { ArticleModel } from '../../model';
import { ArticleCommandRepo } from '../../repo/commands';
import { UpdateArticleTagsController } from './updateArticleTagsController';
import { UpdateArticleTagsUseCase } from './updateArticleTagsUseCase';

const articleCommandRepo = new ArticleCommandRepo(ArticleModel);
const articleTagRepo = new ArticleTagRepo(ArticleTagModel);

const updateArticleTagsUseCase = new UpdateArticleTagsUseCase(articleCommandRepo, articleTagRepo);
export const updateArticleTagsController = new UpdateArticleTagsController(
  updateArticleTagsUseCase,
);
