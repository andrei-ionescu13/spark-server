import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../useCase';
import { KeyStatus } from '../../keyStatus';
import { KeyCommandsRepoI } from '../../repo/commands';
import { UpdateKeysStatusRequestDto } from './updateKeysStatusRequestDto';

type Response = Result<string, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class UpdateKeysStatusUseCase implements UseCase<UpdateKeysStatusRequestDto, Response> {
  constructor(private keyCommandsRepo: KeyCommandsRepoI) {}

  execute = async (request: UpdateKeysStatusRequestDto): Promise<Response> => {
    const { keyId, status } = request;

    try {
      const keyOrError = await this.keyCommandsRepo.getKey(keyId);

      if (keyOrError.isErr()) {
        return Result.fail(keyOrError.error);
      }

      const key = keyOrError.value;

      if (!key) {
        return Result.fail(new UseCaseErrors.NotFound('Key not found'));
      }

      const statusOrError = KeyStatus.create(status);

      if (statusOrError.isErr()) {
        return Result.fail(statusOrError.error);
      }

      const keyStatus = statusOrError.value;
      const changeStatusResult = key.changeStatus(keyStatus);

      if (changeStatusResult.isErr()) {
        return Result.fail(changeStatusResult.error);
      }

      await this.keyCommandsRepo.save(key);

      return Result.ok(key.status.value);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
