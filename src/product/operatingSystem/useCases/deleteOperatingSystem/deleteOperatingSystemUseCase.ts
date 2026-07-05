import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { ProductRepoI } from '../../../productRepo';
import { OperatingSystemCommandsRepoI } from '../../repo/commands';
import { OperatingSystemQueriesRepoI } from '../../repo/queries';
import { DeleteOperatingSystemRequestDto } from './deleteOperatingSystemrRequestDto';

//change this check if there s products using this operatingSystem

type Response = Result<undefined, UseCaseErrors.NotFound | UseCaseErrors.UnexpectedError>;

export class DeleteOperatingSystemUseCase
  implements UseCase<DeleteOperatingSystemRequestDto, Response>
{
  constructor(
    private productRepo: ProductRepoI,
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
      await this.productRepo.deleteProductsOperatingSystem(operatingSystemId);

      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
