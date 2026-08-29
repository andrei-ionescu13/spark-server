import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UseCase } from '../../../../../useCase';
import { NamespaceCommandsRepoI } from '../../repo/commands';
import { NamespaceQueriesRepoI } from '../../repo/queries';
import { DeleteNamespaceRequestDto } from './deleteNamespaceRequestDto';

type Response = Result<string, UseCaseErrors.NotFound | UseCaseErrors.UnexpectedError>;

export class DeleteNamespaceUseCase implements UseCase<DeleteNamespaceRequestDto, Response> {
  constructor(
    private namespaceCommandsRepo: NamespaceCommandsRepoI,
    private namespaceQueriesRepo: NamespaceQueriesRepoI,
  ) {}

  execute = async (request: DeleteNamespaceRequestDto): Promise<Response> => {
    const { namespaceId } = request;

    try {
      const namespace = await this.namespaceQueriesRepo.getNamespace(namespaceId);
      if (!namespace) {
        return Result.fail(new UseCaseErrors.NotFound('Namespace not found'));
      }

      await this.namespaceCommandsRepo.deleteNamespace(namespaceId);
      return Result.ok(namespace._id);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
