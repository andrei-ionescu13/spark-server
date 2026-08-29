import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UseCase } from '../../../../../useCase';
import { NamespaceDto } from '../../namespaceMapper';
import { NamespaceQueriesRepoI } from '../../repo/queries';
import { GetNamespaceRequestDto } from './getNamespaceRequestDto';

type Response = Result<NamespaceDto, UseCaseErrors.NotFound | UseCaseErrors.UnexpectedError>;

export class GetNamespaceUseCase implements UseCase<GetNamespaceRequestDto, Response> {
  constructor(private namespaceQueriesRepo: NamespaceQueriesRepoI) {}

  execute = async (request: GetNamespaceRequestDto): Promise<Response> => {
    const { namespaceId } = request;

    try {
      const namespace = await this.namespaceQueriesRepo.getNamespace(namespaceId);
      const found = !!namespace;

      if (!found) {
        return Result.fail(new UseCaseErrors.NotFound('Namespace not found'));
      }

      return Result.ok(namespace);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
