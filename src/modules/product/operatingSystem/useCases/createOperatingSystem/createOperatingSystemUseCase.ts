import { v7 as uuidv7 } from 'uuid';
import { UseCaseErrors } from '../../../../../appError';
import { Result } from '../../../../../result';
import { UseCase } from '../../../../../useCase';
import { UseCaseError } from '../../../../../useCaseError';
import { OperatingSystem, OperatingSystemCreateProps } from '../../domain/operatingSystem';
import { OperatingSystemDto } from '../../operatingSystemMapper';
import { OperatingSystemCommandsRepoI } from '../../repo/commands';
import { OperatingSystemQueriesRepoI } from '../../repo/queries';
import { CreateOperatingSystemRequestDto } from './createOperatingSystemRequestDto';
import { textUtils } from '../../../../../utils/textUtils';

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
    const slug = request.slug || textUtils.generateSlug(request.name);

    try {
      let existingOperatingSystem =
        await this.operatingSystemQueriesRepo.getOperatingSystemByPropsOr([
          { name: request.name, slug },
        ]);
      if (existingOperatingSystem) {
        const result = this.comparePropsToOperatingSystem(request, existingOperatingSystem);

        if (result.isErr()) {
          return Result.fail(result.error);
        }

        return Result.fail(new CreateOperatingSystemErrors.ValidationError());
      }

      const props: OperatingSystemCreateProps = {
        name: request.name,
        slug,
      };
      const operatingSystemOrError = OperatingSystem.create(props);

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
