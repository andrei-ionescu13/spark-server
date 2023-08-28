import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCaseError } from '../../../UseCaseError';
import { ProductRepoI } from '../../../product/productRepo';
import { UseCase } from '../../../use-case';
import { DeveloperRepoI } from '../../developerRepo';
import { DeleteDeveloperRequestDto } from './deleteDeveloperRequestDto';

export namespace DeleteDeveloperErrors {
  export class DeveloperInUse extends Result<UseCaseError> {
    constructor() {
      super(false, { message: 'An article is using this category' });
    }
  }
}

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class DeleteDeveloperUseCase implements UseCase<DeleteDeveloperRequestDto, Response> {
  constructor(private productRepo: ProductRepoI, private developerRepo: DeveloperRepoI) {}

  execute = async (request: DeleteDeveloperRequestDto): Promise<Response> => {
    const { developerId } = request;

    try {
      const developer = await this.developerRepo.getDeveloper(developerId);
      const found = !!developer;

      if (!found) {
        return left(new AppError.NotFound('Developer not found'));
      }

      await this.developerRepo.deleteDeveloper(developerId);
      await this.productRepo.deleteDeveloper(developerId);

      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
