import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { UseCaseError } from '../../../../UseCaseError';
import { ProductQueriesRepoI } from '../../../repo/queries';
import { FeatureCommandsRepoI } from '../../repo/commands';
import { FeatureQueriesRepoI } from '../../repo/queries';
import { DeleteFeatureBulkRequestDto } from './deleteFeatureBulkRequestDto';

export namespace DeleteFeatureBulkError {
  export class FeatureIsUsed extends UseCaseError {
    constructor() {
      super('A Product is using this feature');
    }
  }
}

type Response = Result<undefined, UseCaseErrors.NotFound | UseCaseErrors.UnexpectedError>;

export class DeleteFeatureBulkUseCase implements UseCase<DeleteFeatureBulkRequestDto, Response> {
  constructor(
    private productQueriesRepo: ProductQueriesRepoI,
    private featureCommandsRepo: FeatureCommandsRepoI,
    private featureQueriesRepo: FeatureQueriesRepoI,
  ) {}

  deleteFeature = async (featureId: string) => {
    const feature = await this.featureQueriesRepo.getFeature(featureId);
    if (!feature) {
      return Result.fail(new UseCaseErrors.NotFound('Feature not found'));
    }

    const product = await this.productQueriesRepo.getProductByGenre(featureId);
    if (!product) {
      return Result.fail(new DeleteFeatureBulkError.FeatureIsUsed());
    }

    await this.featureCommandsRepo.deleteFeature(featureId);

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
