import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCaseError } from '../../../UseCaseError';
import { UseCase } from '../../../use-case';
import { textUtils } from '../../../utils/textUtils';
import { DeveloperRepoI } from '../../developerRepo';
import { Developer } from '../../model';
import { CreateDeveloperRequestDto } from './createDeveloperRequestDto';

export namespace CreateDeveloperErrors {
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

type Response = Either<AppError.UnexpectedError, Result<Developer>>;

export class CreateDeveloperUseCase implements UseCase<CreateDeveloperRequestDto, Response> {
  constructor(private developerRepo: DeveloperRepoI) {}

  comparePropsToDeveloper = (props, tag): Result<UseCaseError> => {
    if (props.name === tag.name) {
      return new CreateDeveloperErrors.NameNotAvailableError();
    }

    if (props.slug === tag.slug) {
      return new CreateDeveloperErrors.SlugNotAvailableError();
    }

    return new AppError.UnexpectedError();
  };

  execute = async (request: CreateDeveloperRequestDto): Promise<Response> => {
    const props = request;
    props.slug ||= textUtils.generateSlug(props.name);

    try {
      let developer = await this.developerRepo.getDeveloperByPropsOr([
        { name: props.name, slug: props.slug },
      ]);
      const found = !!developer;

      if (found) {
        return left(this.comparePropsToDeveloper(props, developer));
      }

      developer = await this.developerRepo.createDeveloper(props);

      return right(Result.ok(developer.name));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
