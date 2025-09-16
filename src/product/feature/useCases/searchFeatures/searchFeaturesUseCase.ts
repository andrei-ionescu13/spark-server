import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { FeatureDto } from '../../featureMapper';
import { FeatureQueriesRepoI } from '../../repo/queries';
import { SearchFeaturesRequestDto } from './searchFeaturesRequestDto';

type Response = Result<{ features: FeatureDto[]; count: number }, UseCaseErrors.UnexpectedError>;

const MAX_LIMIT = 36;
const LIMIT = 10;

export class SearchFeaturesUseCase implements UseCase<SearchFeaturesRequestDto, Response> {
  constructor(private featureQueriesRepo: FeatureQueriesRepoI) {}

  execute = async (request: SearchFeaturesRequestDto): Promise<Response> => {
    const query = {
      ...request,
      limit: request?.limit && request.limit <= MAX_LIMIT ? request.limit : LIMIT,
    };

    try {
      const { features, count } = await this.featureQueriesRepo.searchFeatures(query);
      return Result.ok({ features, count });
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
