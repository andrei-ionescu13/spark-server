import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { OperatingSystemRepoI } from '../../operatingSystemRepo';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class ListOperatingSystemsUseCase implements UseCase<undefined, Response> {
  constructor(private operatingSystemRepo: OperatingSystemRepoI) {}

  execute = async (): Promise<Response> => {
    try {
      const operatingSystems = await this.operatingSystemRepo.listOperatingSystems();

      return right(Result.ok<any>(operatingSystems));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
