import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UseCase } from '../../../../../useCase';
import { UseCaseError } from '../../../../../UseCaseError';
import { OperatingSystemDoc } from '../../model';
import { OperatingSystemDto } from '../../operatingSystemMapper';
import { OperatingSystemCommandsRepoI } from '../../repo/commands';
import { OperatingSystemQueriesRepoI } from '../../repo/queries';
import { UpdateOperatingSystemRequestDto } from './updateOperatingSystemRequestDto';

export namespace UpdateOperatingSystemErrors {
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
  OperatingSystemDoc,
  | UpdateOperatingSystemErrors.NameNotAvailableError
  | UpdateOperatingSystemErrors.SlugNotAvailableError
  | UseCaseErrors.UnexpectedError
  | UseCaseErrors.NotFound
>;

export class UpdateOperatingSystemUseCase
  implements UseCase<UpdateOperatingSystemRequestDto, Response>
{
  constructor(
    private operatingSystemCommandsRepo: OperatingSystemCommandsRepoI,
    private operatingSystemQueriesRepo: OperatingSystemQueriesRepoI,
  ) {}

  comparePropsToOperatingSystem = (
    props: Pick<UpdateOperatingSystemRequestDto, 'name' | 'slug'>,
    operatingSystem: OperatingSystemDto,
  ): Result<
    undefined,
    | UpdateOperatingSystemErrors.NameNotAvailableError
    | UpdateOperatingSystemErrors.SlugNotAvailableError
  > => {
    if (props.name === operatingSystem.name) {
      return Result.fail(new UpdateOperatingSystemErrors.NameNotAvailableError());
    }

    if (props.slug === operatingSystem.slug) {
      return Result.fail(new UpdateOperatingSystemErrors.SlugNotAvailableError());
    }

    return Result.ok();
  };

  execute = async (request: UpdateOperatingSystemRequestDto): Promise<Response> => {
    const { operatingSystemId, ...props } = request;

    try {
      const operatingSystemOrError = await this.operatingSystemCommandsRepo.getOperatingSystem(
        operatingSystemId,
      );
      if (operatingSystemOrError.isErr()) {
        return Result.fail(
          new UseCaseErrors.DomainValidation(operatingSystemOrError.error.message),
        );
      }

      const operatingSystem = operatingSystemOrError.value;
      if (!operatingSystem) {
        return Result.fail(new UseCaseErrors.NotFound('Article tag not found'));
      }

      const operatingSystemFound =
        await this.operatingSystemQueriesRepo.getOperatingSystemByPropsOr([
          { slug: props.slug },
          { name: props.name },
        ]);

      if (operatingSystemFound) {
        const result = this.comparePropsToOperatingSystem(props, operatingSystemFound);
        if (result.isErr()) {
          return Result.fail(result.error);
        }

        return Result.fail(new UpdateOperatingSystemErrors.PropsNotAvailable());
      }

      const updateResult = operatingSystem.update(props.name, props.slug);
      if (updateResult.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(updateResult.error.message));
      }

      return Result.ok(operatingSystem);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
