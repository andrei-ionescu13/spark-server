import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { PlatformRepoI } from '../../platformRepo';
import { GetPlatformRequestDto } from './getPlatformRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class GetPlatformUseCase implements UseCase<GetPlatformRequestDto, Response> {
  constructor(private platformRepo: PlatformRepoI) {}

  execute = async (request: GetPlatformRequestDto): Promise<Response> => {
    const { platformId } = request;

    try {
      const platform = await this.platformRepo.getPlatform(platformId);
      const found = !!platform;

      if (!found) {
        return left(new AppError.NotFound('Platform not found'));
      }

      return right(Result.ok<any>(platform));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
