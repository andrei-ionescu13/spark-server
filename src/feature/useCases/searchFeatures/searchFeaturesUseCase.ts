import { AppError } from '../../../AppError';
import { Either, left, Result, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { FeatureRepoI } from '../../featureRepo';
import { SearchArticleCategoriesRequestDto } from './searchFeaturesRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

const MAX_LIMIT = 36;
const LIMIT = 10;

export class SearchArticleCategoriesUseCase
  implements UseCase<SearchArticleCategoriesRequestDto, Response>
{
  constructor(private featureRepo: FeatureRepoI) {}

  execute = async (request: SearchArticleCategoriesRequestDto): Promise<Response> => {
    const query = request;
    query.limit = query?.limit && query.limit <= MAX_LIMIT ? query.limit : LIMIT;

    try {
      const features = await this.featureRepo.searchArticleCategories(request);
      const count = await this.featureRepo.getArticleCategoriesCount(request);

      return right(Result.ok<any>({ features, count }));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
