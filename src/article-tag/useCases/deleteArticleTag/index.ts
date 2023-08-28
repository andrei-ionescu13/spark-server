import { ArticleRepo } from '../../../article/articleRepo';
import { ArticleModel } from '../../../article/model';
import { ArticleTagRepo } from '../../articleTagRepo';
import { ArticleTagModel } from '../../model';
import { DeleteArticleTagController } from './deleteArticleTagController';
import { DeleteArticleTagUseCase } from './deleteArticleTagUseCase';

const articleRepo = new ArticleRepo(ArticleModel);
const articleTagRepo = new ArticleTagRepo(ArticleTagModel);

const deleteArticleTagUseCase = new DeleteArticleTagUseCase(articleRepo, articleTagRepo);
export const deleteArticleTagController = new DeleteArticleTagController(deleteArticleTagUseCase);
