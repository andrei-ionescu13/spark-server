import { v7 as uuidv7 } from 'uuid';
import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UseCase } from '../../../../../useCase';
import { UseCaseError } from '../../../../../UseCaseError';
import { Feature } from '../../feature';
import { FeatureDto } from '../../featureMapper';
import { FeatureCommandsRepoI } from '../../repo/commands';
import { FeatureQueriesRepoI } from '../../repo/queries';
import { CreateFeatureRequestDto } from './createFeatureRequestDto';

export namespace CreateFeatureErrors {
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

  export class ValidationError extends Error {
    constructor() {
      super('Feature could not be created');
    }
  }
}

type Response = Result<Feature, UseCaseErrors.UnexpectedError>;

export class CreateFeatureUseCase implements UseCase<CreateFeatureRequestDto, Response> {
  constructor(
    private featureCommandsRepo: FeatureCommandsRepoI,
    private featureQueriesRepo: FeatureQueriesRepoI,
  ) {}

  comparePropsToFeature = (
    props: Pick<CreateFeatureRequestDto, 'name' | 'slug'>,
    feature: FeatureDto,
  ): Result<
    undefined,
    CreateFeatureErrors.NameNotAvailableError | CreateFeatureErrors.SlugNotAvailableError
  > => {
    if (props.name === feature.name) {
      return Result.fail(new CreateFeatureErrors.NameNotAvailableError());
    }

    if (props.slug === feature.slug) {
      return Result.fail(new CreateFeatureErrors.SlugNotAvailableError());
    }

    return Result.ok();
  };

  execute = async (request: CreateFeatureRequestDto): Promise<Response> => {
    const props = request;

    try {
      let foundFeature = await this.featureQueriesRepo.getFeatureByPropsOr([
        { name: props.name, slug: props.slug },
      ]);

      if (foundFeature) {
        const result = this.comparePropsToFeature(props, foundFeature);

        if (result.isErr()) {
          return Result.fail(result.error);
        }

        return Result.fail(new CreateFeatureErrors.ValidationError());
      }

      const featureOrError = Feature.create({
        name: props.name,
        slug: props.slug,
        _id: uuidv7(),
        createdAt: new Date(),
      });

      if (featureOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(featureOrError.error.message));
      }

      const feature = featureOrError.value;
      await this.featureCommandsRepo.save(feature);

      return Result.ok(feature);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
