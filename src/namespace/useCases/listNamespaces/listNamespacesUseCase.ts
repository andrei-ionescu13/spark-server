import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { NamespaceRepoI } from '../../namespaceRepo';
import { ListNamespacesRequestDto } from './listNamespacesRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class ListNamespacesUseCase implements UseCase<ListNamespacesRequestDto, Response> {
  constructor(private namespaceRepo: NamespaceRepoI) {}

  execute = async (): Promise<Response> => {
    try {
      const namespaces = await this.namespaceRepo.listNamespaces();

      return right(Result.ok<any>(namespaces));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
