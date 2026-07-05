import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { ProductRepoI } from '../../../productRepo';
import { OperatingSystemCommandsRepoI } from '../../repo/commands';
import { OperatingSystemQueriesRepoI } from '../../repo/queries';
import { DeleteOperatingSystemBulkRequestDto } from './deleteOperatingSystemBulkRequestDto';

type Response = Result<undefined, UseCaseErrors.UnexpectedError>;

export class DeleteOperatingSystemBulkUseCase
  implements UseCase<DeleteOperatingSystemBulkRequestDto, Response>
{
  constructor(
    private productRepo: ProductRepoI,
    private operatingSystemCommandsRepo: OperatingSystemCommandsRepoI,
    private operatingSystemQueriesRepo: OperatingSystemQueriesRepoI,
  ) {}

  deleteOperatingSystem = async (operatingSystemId: string) => {
    const operatingSystem = await this.operatingSystemQueriesRepo.getOperatingSystem(
      operatingSystemId,
    );

    if (!operatingSystem) {
      return Result.fail(new UseCaseErrors.NotFound('OperatingSystem not found'));
    }

    await this.operatingSystemCommandsRepo.deleteOperatingSystem(operatingSystemId);
    await this.productRepo.deleteProductsOperatingSystem(operatingSystemId);

    return Result.ok();
  };

  execute = async (request: DeleteOperatingSystemBulkRequestDto): Promise<Response> => {
    const { ids } = request;

    try {
      const result = Result.combine(
        await Promise.all(
          ids.map((operatingSystemId) => this.deleteOperatingSystem(operatingSystemId)),
        ),
      );

      if (result.isErr()) {
        return Result.fail(result.error);
      }

      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
