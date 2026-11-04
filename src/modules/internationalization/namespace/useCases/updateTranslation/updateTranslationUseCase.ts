import { UseCaseErrors } from '../../../../../appError';
import { Result } from '../../../../../results';
import { UseCase } from '../../../../../useCase';
import { NamespaceTranslation } from '../../domain/namespaceTranslation';
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
      const namespace = await this.namespaceCommandsRepo.getNamespace(namespaceId, {
        'translations.key': key,
      });
      if (!namespace) {
        return Result.fail(new UseCaseErrors.NotFound('Namespace not found'));
      }

      const translationOrError = NamespaceTranslation.create({ ...props, key: props.keyValue });
      if (translationOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(translationOrError.error.message));
      }

      const translation = translationOrError.value;
      const updateResult = namespace.updateTranslation(key, translation);
      if (updateResult.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(updateResult.error.message));
      }

      this.namespaceCommandsRepo.save(namespace);
      return Result.ok(namespaceId);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
