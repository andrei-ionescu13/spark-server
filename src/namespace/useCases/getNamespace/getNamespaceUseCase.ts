import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { NamespaceRepoI } from '../../namespaceRepo';
import { GetNamespaceRequestDto } from './getNamespaceRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class GetNamespaceUseCase implements UseCase<GetNamespaceRequestDto, Response> {
  constructor(private namespaceRepo: NamespaceRepoI) {}

  execute = async (request: GetNamespaceRequestDto): Promise<Response> => {
    const { namespaceId } = request;

    try {
      const namespace = await this.namespaceRepo.getNamespace(namespaceId);
      const found = !!namespace;

      if (!found) {
        return left(new AppError.NotFound('Namespace not found'));
      }

      return right(Result.ok<any>(namespace));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
