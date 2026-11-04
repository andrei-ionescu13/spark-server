import { UseCaseErrors } from '../../../../../appError';
import { Result } from '../../../../../results';
import { UseCaseError } from '../../../../../useCaseError';
import { UseCase } from '../../../../../useCase';
import { Article } from '../../domain/article';
import { ArticleCommandsRepoI } from '../../repo/commands';
import { UpdateArticleMetaRequestDto } from './updateArticleMetaRequestDto';
import { Meta } from '../../../../../meta';
import { MetaDto, MetaMapper } from '../../../../../metaMapper';

export namespace UpdateArticleMetaErrors {
  export class ArchivedArticleError extends UseCaseError {
    constructor() {
      super("Can't update an archived article");
    }
  }
}

type Response = Result<
  MetaDto,
  | UseCaseErrors.UnexpectedError
  | UseCaseErrors.NotFound
  | UpdateArticleMetaErrors.ArchivedArticleError
>;

export class UpdateArticleMetaUseCase implements UseCase<UpdateArticleMetaRequestDto, Response> {
  constructor(private articleCommandsRepo: ArticleCommandsRepoI) {}

  execute = async (request: UpdateArticleMetaRequestDto): Promise<Response> => {
    try {
      const article = await this.articleCommandsRepo.getArticle(request.articleId);
      if (!article) {
        return Result.fail(new UseCaseErrors.NotFound('Article not found'));
      }

      if (article.isArchived) {
        return Result.fail(new UpdateArticleMetaErrors.ArchivedArticleError());
      }

      const metaOrError = Meta.create({
        description: request.description,
        keywords: request.keywords,
        title: request.title,
      });
      if (metaOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(metaOrError.error.message));
      }

      const meta = metaOrError.value;
      const updateResult = article.updateMeta(meta);
      if (updateResult.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(updateResult.error.message));
      }

      await this.articleCommandsRepo.save(article);
      return Result.ok(MetaMapper.domainToDto(article.meta));
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
