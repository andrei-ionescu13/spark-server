import { ProductRepoI } from '../../../../../product/productRepo';
import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { FeatureCommandsRepoI } from '../../repo/commands';
import { FeatureQueriesRepoI } from '../../repo/queries';
import { DeleteFeatureBulkRequestDto } from './deleteFeatureBulkRequestDto';

type Response = Result<undefined, UseCaseErrors.UnexpectedError>;

export class DeleteFeatureBulkUseCase implements UseCase<DeleteFeatureBulkRequestDto, Response> {
  constructor(
    private productRepo: ProductRepoI,
    private featureCommandsRepo: FeatureCommandsRepoI,
    private featureQueriesRepo: FeatureQueriesRepoI,
  ) {}

  deleteFeature = async (featureId: string) => {
    const feature = await this.featureQueriesRepo.getFeature(featureId);

    if (!feature) {
      return Result.fail(new UseCaseErrors.NotFound('Feature not found'));
    }

    await this.featureCommandsRepo.deleteFeature(featureId);
    await this.productRepo.deleteFeature(featureId);

    return Result.ok();
  };

  execute = async (request: DeleteFeatureBulkRequestDto): Promise<Response> => {
    const { ids } = request;

    try {
      const result = Result.combine(
        await Promise.all(ids.map((featureId) => this.deleteFeature(featureId))),
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
