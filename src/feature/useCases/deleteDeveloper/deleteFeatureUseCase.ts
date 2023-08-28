import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCaseError } from '../../../UseCaseError';
import { ProductRepoI } from '../../../product/productRepo';
import { UseCase } from '../../../use-case';
import { FeatureRepoI } from '../../featureRepo';
import { DeleteFeatureRequestDto } from './deleteFeatureRequestDto';

export namespace DeleteFeatureErrors {
  export class FeatureInUse extends Result<UseCaseError> {
    constructor() {
      super(false, { message: 'An article is using this category' });
    }
  }
}

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class DeleteFeatureUseCase implements UseCase<DeleteFeatureRequestDto, Response> {
  constructor(private productRepo: ProductRepoI, private featureRepo: FeatureRepoI) {}

  execute = async (request: DeleteFeatureRequestDto): Promise<Response> => {
    const { featureId } = request;

    try {
      const feature = await this.featureRepo.getFeature(featureId);
      const found = !!feature;

      if (!found) {
        return left(new AppError.NotFound('Feature not found'));
      }

      await this.featureRepo.deleteFeature(featureId);
      await this.productRepo.deleteFeature(featureId);

      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
