import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { NamespaceRepoI } from '../../namespaceRepo';
import { DeleteNamespaceRequestDto } from './deleteNamespaceRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class DeleteNamespaceUseCase implements UseCase<DeleteNamespaceRequestDto, Response> {
  constructor(private namespaceRepo: NamespaceRepoI) {}

  execute = async (request: DeleteNamespaceRequestDto): Promise<Response> => {
    const { namespaceId } = request;

    try {
      const namespace = await this.namespaceRepo.getNamespace(namespaceId);
      const found = !!namespace;

      if (!found) {
        return left(new AppError.NotFound('Namespace not found'));
      }

      await this.namespaceRepo.deleteNamespace(namespaceId);

      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
