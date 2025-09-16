import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { NamespaceDto } from '../../namespaceMapper';
import { NamespaceQueriesRepoI } from '../../repo/queries';
import { ListNamespacesRequestDto } from './listNamespacesRequestDto';

type Response = Result<NamespaceDto[], UseCaseErrors.UnexpectedError>;

export class ListNamespacesUseCase implements UseCase<ListNamespacesRequestDto, Response> {
  constructor(private namespaceQueriesRepo: NamespaceQueriesRepoI) {}

  execute = async (): Promise<Response> => {
    try {
      const namespaces = await this.namespaceQueriesRepo.listNamespaces();
      return Result.ok(namespaces);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
