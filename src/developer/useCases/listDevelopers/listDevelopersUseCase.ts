import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { DeveloperRepoI } from '../../developerRepo';
import { ListDevelopersRequestDto } from './listDevelopersRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class ListDevelopersUseCase implements UseCase<ListDevelopersRequestDto, Response> {
  constructor(private developerRepo: DeveloperRepoI) {}

  execute = async (): Promise<Response> => {
    try {
      const developers = await this.developerRepo.listDevelopers();

      return right(Result.ok(developers));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
