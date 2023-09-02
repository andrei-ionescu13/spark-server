import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { ProductRepoI } from '../../../product/productRepo';
import { UseCase } from '../../../use-case';
import { OperatingSystemRepoI } from '../../operatingSystemRepo';
import { DeleteOperatingSystemRequestDto } from './deleteOperatingSystemRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class DeleteOperatingSystemUseCase
  implements UseCase<DeleteOperatingSystemRequestDto, Response>
{
  constructor(
    private operatingSystemRepo: OperatingSystemRepoI,
    private productRepo: ProductRepoI,
  ) {}

  execute = async (request: DeleteOperatingSystemRequestDto): Promise<Response> => {
    const { operatingSystemId } = request;

    try {
      const operatingSystem = await this.operatingSystemRepo.getOperatingSystem(operatingSystemId);

      if (!operatingSystem) {
        return left(new AppError.NotFound('OperatingSystem not found'));
      }

      await this.operatingSystemRepo.deleteOperatingSystem(operatingSystemId);
      await this.productRepo.deleteProductsOperatingSystem(operatingSystemId);

      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
