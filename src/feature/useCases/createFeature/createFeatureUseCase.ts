import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCaseError } from '../../../UseCaseError';
import { UseCase } from '../../../use-case';
import { textUtils } from '../../../utils/textUtils';
import { FeatureRepoI } from '../../featureRepo';
import { Feature } from '../../model';
import { CreateFeatureRequestDto } from './createFeatureRequestDto';

export namespace CreateFeatureErrors {
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

type Response = Either<AppError.UnexpectedError, Result<Feature>>;

export class CreateFeatureUseCase implements UseCase<CreateFeatureRequestDto, Response> {
  constructor(private featureRepo: FeatureRepoI) {}

  comparePropsToFeature = (props, tag): Result<UseCaseError> => {
    if (props.name === tag.name) {
      return new CreateFeatureErrors.NameNotAvailableError();
    }

    if (props.slug === tag.slug) {
      return new CreateFeatureErrors.SlugNotAvailableError();
    }

    return new AppError.UnexpectedError();
  };

  execute = async (request: CreateFeatureRequestDto): Promise<Response> => {
    const props = request;
    props.slug ||= textUtils.generateSlug(props.name);

    try {
      let feature = await this.featureRepo.getFeatureByPropsOr([
        { name: props.name, slug: props.slug },
      ]);
      const found = !!feature;

      if (found) {
        return left(this.comparePropsToFeature(props, feature));
      }

      feature = await this.featureRepo.createFeature(props);

      return right(Result.ok(feature.name));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
