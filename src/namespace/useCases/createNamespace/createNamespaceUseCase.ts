import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { NamespaceRepoI } from '../../namespaceRepo';
import { CreateNamespaceRequestDto } from './createNamespaceRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class CreateNamespaceUseCase implements UseCase<CreateNamespaceRequestDto, Response> {
  constructor(private namespaceRepo: NamespaceRepoI) {}

  execute = async (request: CreateNamespaceRequestDto): Promise<Response> => {
    const props = request;

    try {
      const namespace = await this.namespaceRepo.createNamespace(props);

      return right(Result.ok<any>(namespace));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
