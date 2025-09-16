import { ArticleTagRepo } from '../../articleTagRepo';
import { ArticleTagModel } from '../../model';
import { CreateArticleTagController } from './createArticleTagController';
import { CreateArticleTagUseCase } from './createArticleTagUseCase';

const articleTagRepo = new ArticleTagRepo(ArticleTagModel);
const createArticleTagUseCase = new CreateArticleTagUseCase(articleTagRepo);
export const createArticleTagController = new CreateArticleTagController(createArticleTagUseCase);
