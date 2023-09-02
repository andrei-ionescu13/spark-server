import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { FeatureRepoI } from '../../featureRepo';
import { ListFeaturesRequestDto } from './listFeaturesRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class ListFeaturesUseCase implements UseCase<ListFeaturesRequestDto, Response> {
  constructor(private featureRepo: FeatureRepoI) {}

  execute = async (): Promise<Response> => {
    try {
      const features = await this.featureRepo.listFeatures();

      return right(Result.ok(features));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
