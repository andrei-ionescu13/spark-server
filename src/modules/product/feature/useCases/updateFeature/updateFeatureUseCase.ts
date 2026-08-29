import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UseCase } from '../../../../../useCase';
import { UseCaseError } from '../../../../../UseCaseError';
import { FeatureDto } from '../../featureMapper';
import { FeatureDoc } from '../../model';
import { FeatureCommandsRepoI } from '../../repo/commands';
import { FeatureQueriesRepoI } from '../../repo/queries';
import { UpdateFeatureRequestDto } from './updateFeatureRequestDto';

export namespace UpdateFeatureErrors {
  export class NameNotAvailableError extends UseCaseError {
    constructor() {
      super('Name not available');
    }
  }

  export class SlugNotAvailableError extends UseCaseError {
    constructor() {
      super('Slug not available');
    }
  }

  export class PropsNotAvailable extends UseCaseError {
    constructor() {
      super('Fields not available');
    }
  }
}

type Response = Result<
  FeatureDoc,
  | UpdateFeatureErrors.NameNotAvailableError
  | UpdateFeatureErrors.SlugNotAvailableError
  | UseCaseErrors.UnexpectedError
  | UseCaseErrors.NotFound
>;

export class UpdateFeatureUseCase implements UseCase<UpdateFeatureRequestDto, Response> {
  constructor(
    private featureCommandsRepo: FeatureCommandsRepoI,
    private featureQueriesRepo: FeatureQueriesRepoI,
  ) {}

  comparePropsToFeature = (
    props: Pick<UpdateFeatureRequestDto, 'name' | 'slug'>,
    feature: FeatureDto,
  ): Result<
    undefined,
    UpdateFeatureErrors.NameNotAvailableError | UpdateFeatureErrors.SlugNotAvailableError
  > => {
    if (props.name === feature.name) {
      return Result.fail(new UpdateFeatureErrors.NameNotAvailableError());
    }

    if (props.slug === feature.slug) {
      return Result.fail(new UpdateFeatureErrors.SlugNotAvailableError());
    }

    return Result.ok();
  };

  execute = async (request: UpdateFeatureRequestDto): Promise<Response> => {
    const { featureId, ...props } = request;

    try {
      const featureOrError = await this.featureCommandsRepo.getFeature(featureId);
      if (featureOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(featureOrError.error.message));
      }

      const feature = featureOrError.value;
      if (!feature) {
        return Result.fail(new UseCaseErrors.NotFound('Article tag not found'));
      }

      const featureFound = await this.featureQueriesRepo.getFeatureByPropsOr([
        { slug: props.slug },
        { name: props.name },
      ]);

      if (featureFound) {
        const result = this.comparePropsToFeature(props, featureFound);
        if (result.isErr()) {
          return Result.fail(result.error);
        }

        return Result.fail(new UpdateFeatureErrors.PropsNotAvailable());
      }

      const updateResult = feature.update(props.name, props.slug);
      if (updateResult.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(updateResult.error.message));
      }

      return Result.ok(feature);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
