import { UseCaseErrors } from '../../../../../appError';
import { Result } from '../../../../../result';
import { UseCase } from '../../../../../useCase';
import { NamespaceDto } from '../../namespaceMapper';
import { NamespaceQueriesRepoI } from '../../repo/queries';

type Response = Result<NamespaceDto[], UseCaseErrors.UnexpectedError>;

export class ListNamespacesUseCase implements UseCase<undefined, Response> {
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
