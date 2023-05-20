import { AppError } from '../../../AppError';
import { Either, Result, left } from '../../../Result';
import { UseCaseError } from '../../../UseCaseError';
import { UseCase } from '../../../use-case';
import { KeyRepoI } from '../../keyRepo';
import { UpdateKeysStatusRequestDto } from './updateKeysStatusRequestDto';

export namespace UpdateKeysStatusErrors {
  export class SecretKeyError extends Result<UseCaseError> {
    constructor() {
      super(false, { message: "Can't modify a secret key" });
    }
  }
}

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class UpdateKeysStatusUseCase implements UseCase<UpdateKeysStatusRequestDto, Response> {
  constructor(private keyRepo: KeyRepoI) {}

  execute = async (request: UpdateKeysStatusRequestDto): Promise<Response> => {
    const { keyId, status } = request;

    try {
      const key = await this.keyRepo.getKey(keyId);

      if (!key) {
        return left(new AppError.NotFound('Key not found'));
      }

      if (key.status === 'secret') {
        return left(new UpdateKeysStatusErrors.SecretKeyError());
      }

      const updatedKey = await this.keyRepo.updateKey(keyId, { status });

      return updatedKey.status;
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
