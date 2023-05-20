import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { NamespaceRepoI } from '../../namespaceRepo';
import { UpdateNamespaceRequestDto } from './updateNamespaceRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class UpdateNamespaceUseCase implements UseCase<UpdateNamespaceRequestDto, Response> {
  constructor(private namespaceRepo: NamespaceRepoI) {}

  execute = async (request: UpdateNamespaceRequestDto): Promise<Response> => {
    const { namespaceId, name } = request;

    try {
      const namespace = await this.namespaceRepo.updateNamespace(namespaceId, { name });
      return right(Result.ok<any>(namespace));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
