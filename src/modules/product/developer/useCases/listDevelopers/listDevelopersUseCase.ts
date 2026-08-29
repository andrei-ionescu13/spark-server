import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UseCase } from '../../../../../useCase';
import { DeveloperDto } from '../../developerMapper';
import { DeveloperQueriesRepoI } from '../../repo/queries';
import { ListDevelopersRequestDto } from './listDevelopersRequestDto';

type Response = Result<DeveloperDto[], UseCaseErrors.UnexpectedError>;

export class ListDevelopersUseCase implements UseCase<ListDevelopersRequestDto, Response> {
  constructor(private developerQueriesRepo: DeveloperQueriesRepoI) {}

  execute = async (request: ListDevelopersRequestDto): Promise<Response> => {
    try {
      const developers = await this.developerQueriesRepo.listDevelopers();
      return Result.ok(developers);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
