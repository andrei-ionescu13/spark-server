import { UseCaseErrors } from '../../../../../appError';
import { Result } from '../../../../../result';
import { UseCase } from '../../../../../useCase';
import { FeatureDto } from '../../featureMapper';
import { FeatureQueriesRepoI } from '../../repo/queries';

type Response = Result<FeatureDto[], UseCaseErrors.UnexpectedError>;

export class ListFeaturesUseCase implements UseCase<undefined, Response> {
  constructor(private featureQueriesRepo: FeatureQueriesRepoI) {}

  execute = async (): Promise<Response> => {
    try {
      const features = await this.featureQueriesRepo.listFeatures();
      return Result.ok(features);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
