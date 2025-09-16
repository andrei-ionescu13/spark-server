import { v7 as uuidv7 } from 'uuid';
import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { UseCaseError } from '../../../../UseCaseError';
import { Namespace } from '../../namespace';
import { NamespaceCommandsRepoI } from '../../repo/commands';
import { NamespaceQueriesRepoI } from '../../repo/queries';
import { CreateNamespaceRequestDto } from './createNamespaceRequestDto';

export namespace CreateNamespaceErrors {
  export class NameNotAvailable extends UseCaseError {
    constructor() {
      super('Name not available');
    }
  }
}

type Response = Result<Namespace, UseCaseErrors.NotFound | UseCaseErrors.UnexpectedError>;

export class CreateNamespaceUseCase implements UseCase<CreateNamespaceRequestDto, Response> {
  constructor(
    private namespaceCommandsRepo: NamespaceCommandsRepoI,
    private namespaceQueriesRepo: NamespaceQueriesRepoI,
  ) {}

  execute = async (request: CreateNamespaceRequestDto): Promise<Response> => {
    const props = request;

    try {
      const namespaceFound = await this.namespaceQueriesRepo.getNamespaceByName(props.name);
      if (!!namespaceFound) {
        return Result.fail(new CreateNamespaceErrors.NameNotAvailable());
      }

      const namespaceOrError = Namespace.create({ ...props, _id: uuidv7() });

      if (namespaceOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(namespaceOrError.error.message));
      }

      const namespace = namespaceOrError.value;
      this.namespaceCommandsRepo.save(namespace);

      return Result.ok(namespace);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
