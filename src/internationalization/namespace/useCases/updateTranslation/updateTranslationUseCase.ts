import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { NamespaceTranslation } from '../../namespaceTransation';
import { NamespaceCommandsRepoI } from '../../repo/commands';
import { UpdateTranslationRequestDto } from './updateTranslationRequestDto';

type Response = Result<
  string,
  UseCaseErrors.UnexpectedError | UseCaseErrors.DomainValidation | UseCaseErrors.NotFound
>;

export class UpdateTranslationUseCase implements UseCase<UpdateTranslationRequestDto, Response> {
  constructor(private namespaceCommandsRepo: NamespaceCommandsRepoI) {}

  execute = async (request: UpdateTranslationRequestDto): Promise<Response> => {
    const { namespaceId, key, ...props } = request;

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

      const translationOrError = NamespaceTranslation.create({ key, ...props });
      if (translationOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(translationOrError.error.message));
      }

      const translation = translationOrError.value;
      namespace.updateTranslation(key, translation);

      return Result.ok(namespaceId);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
