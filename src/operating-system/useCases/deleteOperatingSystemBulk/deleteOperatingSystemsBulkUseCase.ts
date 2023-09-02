import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { ProductRepoI } from '../../../product/productRepo';
import { UseCase } from '../../../use-case';
import { OperatingSystemRepoI } from '../../operatingSystemRepo';
import { DeleteOperatingSystemsBulkRequestDto } from './deleteOperatingSystemsBulkRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class DeleteOperatingSystemsBulkUseCase
  implements UseCase<DeleteOperatingSystemsBulkRequestDto, Response>
{
  constructor(
    private operatingSystemRepo: OperatingSystemRepoI,
    private productRepo: ProductRepoI,
  ) {}

  deleteOperatingSystem = async (operatingSystemId) => {
    const operatingSystem = await this.operatingSystemRepo.getOperatingSystem(operatingSystemId);

    if (!operatingSystem) {
      return left(new AppError.NotFound('OperatingSystem not found'));
    }

    await this.operatingSystemRepo.deleteOperatingSystem(operatingSystemId);
    await this.productRepo.deleteProductsOperatingSystem(operatingSystemId);
  };

  execute = async (request: DeleteOperatingSystemsBulkRequestDto): Promise<Response> => {
    const { ids } = request;

    try {
      await Promise.all(
        ids.map((operatingSystemId) => this.deleteOperatingSystem(operatingSystemId)),
      );
      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
