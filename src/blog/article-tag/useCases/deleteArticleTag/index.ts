import { ArticleModel } from '../../../article/model';
import { ArticleCommandRepo } from '../../../article/repo/commands';
import { ArticleTagRepo } from '../../articleTagRepo';
import { ArticleTagModel } from '../../model';
import { DeleteArticleTagController } from './deleteArticleTagController';
import { DeleteArticleTagUseCase } from './deleteArticleTagUseCase';

const articleCommandRepo = new ArticleCommandRepo(ArticleModel);
const articleTagRepo = new ArticleTagRepo(ArticleTagModel);

const deleteArticleTagUseCase = new DeleteArticleTagUseCase(articleCommandRepo, articleTagRepo);
export const deleteArticleTagController = new DeleteArticleTagController(deleteArticleTagUseCase);
