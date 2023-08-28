import { ArticleTagRepo } from '../../articleTagRepo';
import { ArticleTagModel } from '../../model';
import { UpdateArticleTagController } from './updateArticleTagController';
import { UpdateArticleTagUseCase } from './updateArticleTagUseCase';

const articleTagRepo = new ArticleTagRepo(ArticleTagModel);
const updateArticleTagUseCase = new UpdateArticleTagUseCase(articleTagRepo);
export const updateArticleTagController = new UpdateArticleTagController(updateArticleTagUseCase);
