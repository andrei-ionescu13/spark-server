import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { PlatformRepoI } from '../../platformRepo';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class ListPlatformsUseCase implements UseCase<undefined, Response> {
  constructor(private platformRepo: PlatformRepoI) {}

  execute = async (): Promise<Response> => {
    try {
      const platforms = await this.platformRepo.listPlatforms();

      return right(Result.ok<any>(platforms));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
