import { ProductRepoI } from '../../../../../product/productRepo';
import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { FeatureCommandsRepoI } from '../../repo/commands';
import { FeatureQueriesRepoI } from '../../repo/queries';
import { DeleteFeatureRequestDto } from './deleteFeaturerRequestDto';

//change this check if there s products using this feature

type Response = Result<undefined, UseCaseErrors.NotFound | UseCaseErrors.UnexpectedError>;

export class DeleteFeatureUseCase implements UseCase<DeleteFeatureRequestDto, Response> {
  constructor(
    private productRepo: ProductRepoI,
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

      await this.featureCommandsRepo.deleteFeature(featureId);
      await this.productRepo.deleteFeature(featureId);

      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
