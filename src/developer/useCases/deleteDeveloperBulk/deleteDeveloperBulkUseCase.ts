import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCaseError } from '../../../UseCaseError';
import { ProductRepoI } from '../../../product/productRepo';
import { UseCase } from '../../../use-case';
import { DeveloperRepoI } from '../../developerRepo';
import { DeleteDeveloperBulkRequestDto } from './deleteDeveloperBulkRequestDto';

export namespace DeleteDeveloperBulkErrors {
  export class DeveloperInUse extends Result<UseCaseError> {
    constructor() {
      super(false, { message: 'An article is using this category' });
    }
  }
}

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class DeleteDeveloperBulkUseCase
  implements UseCase<DeleteDeveloperBulkRequestDto, Response>
{
  constructor(private productRepo: ProductRepoI, private developerRepo: DeveloperRepoI) {}

  deleteDeveloper = async (developerId: string) => {
    const developer = await this.developerRepo.getDeveloper(developerId);
    const found = !!developer;

    if (!found) {
      return left(new AppError.NotFound('Developer not found'));
    }

    await this.developerRepo.deleteDeveloper(developerId);
    await this.productRepo.deleteDeveloper(developerId);

    return right(Result.ok());
  };

  execute = async (request: DeleteDeveloperBulkRequestDto): Promise<Response> => {
    const { ids } = request;

    try {
      await Promise.all(ids.map((developerId) => this.deleteDeveloper(developerId)));

      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
