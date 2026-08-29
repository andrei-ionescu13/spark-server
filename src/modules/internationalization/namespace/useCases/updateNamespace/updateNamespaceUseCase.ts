import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UseCase } from '../../../../../useCase';
import { Namespace } from '../../namespace';
import { NamespaceCommandsRepoI } from '../../repo/commands';
import { UpdateNamespaceRequestDto } from './updateNamespaceRequestDto';

type Response = Result<Namespace, UseCaseErrors.NotFound | UseCaseErrors.UnexpectedError>;

export class UpdateNamespaceUseCase implements UseCase<UpdateNamespaceRequestDto, Response> {
  constructor(private namespaceCommandsRepo: NamespaceCommandsRepoI) {}

  execute = async (request: UpdateNamespaceRequestDto): Promise<Response> => {
    const { namespaceId, name } = request;

    try {
      const namespaceOrError = await this.namespaceCommandsRepo.getNamespace(namespaceId);
      if (namespaceOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(namespaceOrError.error.message));
      }

      const namespace = namespaceOrError.value;
      if (!namespace) {
        return Result.fail(new UseCaseErrors.NotFound('Namespace not found'));
      }

      namespace.updateName(name);
      return Result.ok(namespace);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
