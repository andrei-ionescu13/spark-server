import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCaseError } from '../../../UseCaseError';
import { UseCase } from '../../../use-case';
import { textUtils } from '../../../utils/textUtils';
import { FeatureRepo, FeatureRepoI } from '../../featureRepo';
import { Feature } from '../../model';
import { UpdateFeatureRequestDto } from './updateFeatureRequestDto';

export namespace UpdateFeatureErrors {
  export class NameNotAvailableError extends Result<UseCaseError> {
    constructor() {
      super(false, { message: 'Name not available' });
    }
  }

  export class SlugNotAvailableError extends Result<UseCaseError> {
    constructor() {
      super(false, { message: 'Slug not available' });
    }
  }
}

type Response = Either<
  | UpdateFeatureErrors.NameNotAvailableError
  | UpdateFeatureErrors.SlugNotAvailableError
  | AppError.UnexpectedError
  | AppError.NotFound,
  Result<Feature>
>;

export class UpdateFeatureUseCase implements UseCase<UpdateFeatureRequestDto, Response> {
  constructor(private featureRepo: FeatureRepoI) {}

  comparePropsToFeature = (props, tag): Result<UseCaseError> => {
    if (props.name === tag.name) {
      return new UpdateFeatureErrors.NameNotAvailableError();
    }

    if (props.slug === tag.slug) {
      return new UpdateFeatureErrors.SlugNotAvailableError();
    }

    return new AppError.UnexpectedError();
  };

  execute = async (request: UpdateFeatureRequestDto): Promise<Response> => {
    const { featureId, ...props } = request;

    try {
      console.log(featureId);
      const featureToUpdate = await this.featureRepo.getFeature(featureId);
      let featureToUpdateFound = !!featureToUpdate;

      if (!featureToUpdateFound) {
        return left(new AppError.NotFound('Article tag not found'));
      }

      const existingFeature = await this.featureRepo.getFeatureByPropsOr([
        { slug: props.slug },
        { name: props.name },
      ]);
      const featureFound = !!existingFeature;

      if (featureFound) {
        return left(this.comparePropsToFeature(props, existingFeature));
      }

      const updatedFeature = await this.featureRepo.updateArticle(featureId, props);

      if (!updatedFeature) {
        return left(new AppError.NotFound('Article category not found'));
      }

      return right(Result.ok(updatedFeature));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
