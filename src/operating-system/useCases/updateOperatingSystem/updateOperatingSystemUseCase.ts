import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { OperatingSystemRepoI } from '../../operatingSystemRepo';
import { UpdateOperatingSystemRequestDto } from './updateOperatingSystemRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class UpdateOperatingSystemUseCase
  implements UseCase<UpdateOperatingSystemRequestDto, Response>
{
  constructor(private operatingSystemRepo: OperatingSystemRepoI) {}

  execute = async (request: UpdateOperatingSystemRequestDto): Promise<Response> => {
    const { operatingSystemId, ...rest } = request;
    const props = rest;

    try {
      const operatingSystem = await this.operatingSystemRepo.getOperatingSystem(operatingSystemId);

      if (!operatingSystem) {
        return left(new AppError.NotFound('OperatingSystem not found'));
      }

      const updatedOperatingSystem = await this.operatingSystemRepo.updateOperatingSystem(
        operatingSystemId,
        props,
      );

      return right(Result.ok<any>(updatedOperatingSystem));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
