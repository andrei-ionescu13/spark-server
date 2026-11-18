import { UseCaseErrors } from '../../../../../appError';
import { Result } from '../../../../../result';
import { UseCase } from '../../../../../useCase';
import { DeveloperDto } from '../../developerMapper';
import { DeveloperQueriesRepoI } from '../../repo/queries';

type Response = Result<DeveloperDto[], UseCaseErrors.UnexpectedError>;

export class ListDevelopersUseCase implements UseCase<undefined, Response> {
  constructor(private developerQueriesRepo: DeveloperQueriesRepoI) {}

  execute = async (): Promise<Response> => {
    try {
      const developers = await this.developerQueriesRepo.listDevelopers();
      return Result.ok(developers);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
