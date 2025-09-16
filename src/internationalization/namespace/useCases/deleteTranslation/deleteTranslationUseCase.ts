import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { NamespaceCommandsRepoI } from '../../repo/commands';
import { DeleteTranslationRequestDto } from './deleteTranslationRequestDto';

type Response = Result<string, UseCaseErrors.NotFound | UseCaseErrors.UnexpectedError>;

export class DeleteTranslationUseCase implements UseCase<DeleteTranslationRequestDto, Response> {
  constructor(private namespaceCommandsRepo: NamespaceCommandsRepoI) {}

  execute = async (request: DeleteTranslationRequestDto): Promise<Response> => {
    const { namespaceId, key } = request;

    try {
      const namespaceOrError = await this.namespaceCommandsRepo.getNamespace(namespaceId, {
        'translations.key': key,
      });

      if (namespaceOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(namespaceOrError.error.message));
      }

      const namespace = namespaceOrError.value;
      if (!namespace) {
        return Result.fail(new UseCaseErrors.NotFound('Namespace not found'));
      }

      const removeResult = namespace.removeTranslation(key);

      if (removeResult.isErr()) {
        return Result.fail(new UseCaseErrors.NotFound('Namespace not found'));
      }

      return Result.ok(key);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
