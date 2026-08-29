import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UseCase } from '../../../../../useCase';
import { UseCaseError } from '../../../../../UseCaseError';
import { ProductQueriesRepoI } from '../../../repo/queries';
import { FeatureCommandsRepoI } from '../../repo/commands';
import { FeatureQueriesRepoI } from '../../repo/queries';
import { DeleteFeatureRequestDto } from './deleteFeaturerRequestDto';

export namespace DeleteFeatureErrors {
  export class FeatureInUse extends UseCaseError {
    constructor() {
      super('A product is using this feature');
    }
  }
}

type Response = Result<
  undefined,
  DeleteFeatureErrors.FeatureInUse | UseCaseErrors.NotFound | UseCaseErrors.UnexpectedError
>;

export class DeleteFeatureUseCase implements UseCase<DeleteFeatureRequestDto, Response> {
  constructor(
    private productQueriesRepo: ProductQueriesRepoI,
    private featureCommandsRepo: FeatureCommandsRepoI,
    private featureQueriesRepo: FeatureQueriesRepoI,
  ) {}

  execute = async (request: DeleteFeatureRequestDto): Promise<Response> => {
    const { featureId } = request;

    try {
      const feature = await this.featureQueriesRepo.getFeature(featureId);

      if (!feature) {
        return Result.fail(new UseCaseErrors.NotFound('Feature not found'));
      }

      const product = await this.productQueriesRepo.getProductByFeature(featureId);
      if (product) {
        return Result.fail(new DeleteFeatureErrors.FeatureInUse());
      }

      await this.featureCommandsRepo.deleteFeature(featureId);
      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
