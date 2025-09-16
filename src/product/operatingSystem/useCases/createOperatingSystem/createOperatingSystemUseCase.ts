import { v7 as uuidv7 } from 'uuid';
import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { UseCaseError } from '../../../../UseCaseError';
import { OperatingSystem } from '../../operatingSystem';
import { OperatingSystemDto } from '../../operatingSystemMapper';
import { OperatingSystemCommandsRepoI } from '../../repo/commands';
import { OperatingSystemQueriesRepoI } from '../../repo/queries';
import { CreateOperatingSystemRequestDto } from './createOperatingSystemRequestDto';

export namespace CreateOperatingSystemErrors {
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
      super('OperatingSystem could not be created');
    }
  }
}

type Response = Result<OperatingSystem, UseCaseErrors.UnexpectedError>;

export class CreateOperatingSystemUseCase
  implements UseCase<CreateOperatingSystemRequestDto, Response>
{
  constructor(
    private operatingSystemCommandsRepo: OperatingSystemCommandsRepoI,
    private operatingSystemQueriesRepo: OperatingSystemQueriesRepoI,
  ) {}

  comparePropsToOperatingSystem = (
    props: Pick<CreateOperatingSystemRequestDto, 'name' | 'slug'>,
    operatingSystem: OperatingSystemDto,
  ): Result<
    undefined,
    | CreateOperatingSystemErrors.NameNotAvailableError
    | CreateOperatingSystemErrors.SlugNotAvailableError
  > => {
    if (props.name === operatingSystem.name) {
      return Result.fail(new CreateOperatingSystemErrors.NameNotAvailableError());
    }

    if (props.slug === operatingSystem.slug) {
      return Result.fail(new CreateOperatingSystemErrors.SlugNotAvailableError());
    }

    return Result.ok();
  };

  execute = async (request: CreateOperatingSystemRequestDto): Promise<Response> => {
    const props = request;

    try {
      let foundOperatingSystem = await this.operatingSystemQueriesRepo.getOperatingSystemByPropsOr([
        { name: props.name, slug: props.slug },
      ]);

      if (foundOperatingSystem) {
        const result = this.comparePropsToOperatingSystem(props, foundOperatingSystem);

        if (result.isErr()) {
          return Result.fail(result.error);
        }

        return Result.fail(new CreateOperatingSystemErrors.ValidationError());
      }

      const operatingSystemOrError = OperatingSystem.create({
        name: props.name,
        slug: props.slug,
        _id: uuidv7(),
        createdAt: new Date(),
      });

      if (operatingSystemOrError.isErr()) {
        return Result.fail(
          new UseCaseErrors.DomainValidation(operatingSystemOrError.error.message),
        );
      }

      const operatingSystem = operatingSystemOrError.value;
      await this.operatingSystemCommandsRepo.save(operatingSystem);

      return Result.ok(operatingSystem);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
