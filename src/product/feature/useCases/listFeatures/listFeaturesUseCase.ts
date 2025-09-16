import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { FeatureDto } from '../../featureMapper';
import { FeatureQueriesRepoI } from '../../repo/queries';
import { ListFeaturesRequestDto } from './listFeaturesRequestDto';

type Response = Result<FeatureDto[], UseCaseErrors.UnexpectedError>;

export class ListFeaturesUseCase implements UseCase<ListFeaturesRequestDto, Response> {
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
