import { UseCaseErrors } from '../../../../../appErrors';
import { Result } from '../../../../../results';
import { UseCase } from '../../../../../useCase';
import { UseCaseError } from '../../../../../useCaseErrors';
import { Namespace } from '../../domain/namespace';
import { NamespaceTranslation } from '../../domain/namespaceTranslation';
import { NamespaceCommandsRepoI } from '../../repo/commands';
import { CreateTranslationRequestDto } from './createTranslationRequestDto';

export namespace CreateTranslationErrors {
  export class KeyIsUserError extends UseCaseError {
    constructor(error: string) {
      super(error);
    }
  }
}

type Response = Result<
  Namespace,
  | CreateTranslationErrors.KeyIsUserError
  | UseCaseErrors.NotFound
  | UseCaseErrors.DomainValidation
  | UseCaseErrors.UnexpectedError
>;

export class CreateTranslationUseCase implements UseCase<CreateTranslationRequestDto, Response> {
  constructor(private namespaceCommandsRepo: NamespaceCommandsRepoI) {}

  execute = async (request: CreateTranslationRequestDto): Promise<Response> => {
    const { namespaceId, ...props } = request;

    try {
      const namespace = await this.namespaceCommandsRepo.getNamespace(namespaceId);
      if (!namespace) {
        return Result.fail(new UseCaseErrors.NotFound('Namespace not found'));
      }

      const translationOrError = NamespaceTranslation.create(props);
      if (translationOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(translationOrError.error.message));
      }

      const translation = translationOrError.value;
      const addResult = namespace.addTranslation(translation);

      if (addResult.isErr()) {
        return Result.fail(new CreateTranslationErrors.KeyIsUserError(addResult.error.message));
      }

      this.namespaceCommandsRepo.save(namespace);
      return Result.ok(namespace);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
