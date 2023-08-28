import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCaseError } from '../../../UseCaseError';
import { UseCase } from '../../../use-case';
import { textUtils } from '../../../utils/textUtils';
import { DeveloperRepo, DeveloperRepoI } from '../../developerRepo';
import { Developer } from '../../model';
import { UpdateDeveloperRequestDto } from './updateDeveloperRequestDto';

export namespace UpdateDeveloperErrors {
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
  | UpdateDeveloperErrors.NameNotAvailableError
  | UpdateDeveloperErrors.SlugNotAvailableError
  | AppError.UnexpectedError
  | AppError.NotFound,
  Result<Developer>
>;

export class UpdateDeveloperUseCase implements UseCase<UpdateDeveloperRequestDto, Response> {
  constructor(private developerRepo: DeveloperRepoI) {}

  comparePropsToDeveloper = (props, tag): Result<UseCaseError> => {
    if (props.name === tag.name) {
      return new UpdateDeveloperErrors.NameNotAvailableError();
    }

    if (props.slug === tag.slug) {
      return new UpdateDeveloperErrors.SlugNotAvailableError();
    }

    return new AppError.UnexpectedError();
  };

  execute = async (request: UpdateDeveloperRequestDto): Promise<Response> => {
    const { developerId, ...props } = request;

    try {
      console.log(developerId);
      const developerToUpdate = await this.developerRepo.getDeveloper(developerId);
      let developerToUpdateFound = !!developerToUpdate;

      if (!developerToUpdateFound) {
        return left(new AppError.NotFound('Article tag not found'));
      }

      const existingDeveloper = await this.developerRepo.getDeveloperByPropsOr([
        { slug: props.slug },
        { name: props.name },
      ]);
      const developerFound = !!existingDeveloper;

      if (developerFound) {
        return left(this.comparePropsToDeveloper(props, existingDeveloper));
      }

      const updatedDeveloper = await this.developerRepo.updateDeveloper(developerId, props);

      if (!updatedDeveloper) {
        return left(new AppError.NotFound('Article category not found'));
      }

      return right(Result.ok(updatedDeveloper));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
