import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { OperatingSystemDto } from '../../operatingSystemMapper';
import { OperatingSystemQueriesRepoI } from '../../repo/queries';
import { ListOperatingSystemsRequestDto } from './listOperatingSystemsRequestDto';

type Response = Result<OperatingSystemDto[], UseCaseErrors.UnexpectedError>;

export class ListOperatingSystemsUseCase
  implements UseCase<ListOperatingSystemsRequestDto, Response>
{
  constructor(private operatingSystemQueriesRepo: OperatingSystemQueriesRepoI) {}

  execute = async (): Promise<Response> => {
    try {
      const operatingSystems = await this.operatingSystemQueriesRepo.listOperatingSystems();
      return Result.ok(operatingSystems);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
