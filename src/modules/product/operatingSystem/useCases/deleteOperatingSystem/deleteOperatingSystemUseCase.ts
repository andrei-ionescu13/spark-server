import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UseCase } from '../../../../../useCase';
import { ProductCommandsRepoI } from '../../../repo/commands';
import { OperatingSystemCommandsRepoI } from '../../repo/commands';
import { OperatingSystemQueriesRepoI } from '../../repo/queries';
import { DeleteOperatingSystemRequestDto } from './deleteOperatingSystemrRequestDto';

type Response = Result<undefined, UseCaseErrors.NotFound | UseCaseErrors.UnexpectedError>;

export class DeleteOperatingSystemUseCase
  implements UseCase<DeleteOperatingSystemRequestDto, Response>
{
  constructor(
    private productCommandsRepo: ProductCommandsRepoI,
    private operatingSystemCommandsRepo: OperatingSystemCommandsRepoI,
    private operatingSystemQueriesRepo: OperatingSystemQueriesRepoI,
  ) {}

  execute = async (request: DeleteOperatingSystemRequestDto): Promise<Response> => {
    const { operatingSystemId } = request;

    try {
      const operatingSystem = await this.operatingSystemQueriesRepo.getOperatingSystem(
        operatingSystemId,
      );

      if (!operatingSystem) {
        return Result.fail(new UseCaseErrors.NotFound('OperatingSystem not found'));
      }

      await this.operatingSystemCommandsRepo.deleteOperatingSystem(operatingSystemId);
      await this.productCommandsRepo.deleteProductsOperatingSystem(operatingSystemId);

      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
