import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { UseCaseError } from '../../../UseCaseError';
import { NamespaceRepoI } from '../../namespaceRepo';
import { CreateNamespaceRequestDto } from './createNamespaceRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export namespace CreateNamespaceErrors {
  export class NameNotAvailable extends Result<UseCaseError> {
    constructor() {
      super(false, { message: 'Name not available' });
    }
  }
}

export class CreateNamespaceUseCase implements UseCase<CreateNamespaceRequestDto, Response> {
  constructor(private namespaceRepo: NamespaceRepoI) {}

  execute = async (request: CreateNamespaceRequestDto): Promise<Response> => {
    const props = request;

    try {
      const namespaceFound = await this.namespaceRepo.getNamespaceByName(props.name);

      if (!!namespaceFound) {
        return left(new CreateNamespaceErrors.NameNotAvailable());
      }

      const namespace = await this.namespaceRepo.createNamespace(props);

      return right(Result.ok<any>(namespace));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
