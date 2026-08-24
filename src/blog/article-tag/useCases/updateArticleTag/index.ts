import { ArticleTagModel } from '../../model';
import { ArticleTagCommandsRepo } from '../../repo/commands';
import { ArticleTagQueryRepo } from '../../repo/queries';
import { UpdateArticleTagController } from './updateArticleTagController';
import { UpdateArticleTagUseCase } from './updateArticleTagUseCase';

const articleTagQueryRepo = new ArticleTagQueryRepo(ArticleTagModel);
const articleTagCommandsRepo = new ArticleTagCommandsRepo(ArticleTagModel);
const updateArticleTagUseCase = new UpdateArticleTagUseCase(
  articleTagQueryRepo,
  articleTagCommandsRepo,
);
export const updateArticleTagController = new UpdateArticleTagController(updateArticleTagUseCase);
