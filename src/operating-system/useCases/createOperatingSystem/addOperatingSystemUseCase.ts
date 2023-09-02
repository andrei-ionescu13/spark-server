import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { textUtils } from '../../../utils/textUtils';
import { OperatingSystemRepoI } from '../../operatingSystemRepo';
import { AddOperatingSystemRequestDto } from './addOperatingSystemRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class AddOperatingSystemUseCase implements UseCase<AddOperatingSystemRequestDto, Response> {
  constructor(private operatingSystemRepo: OperatingSystemRepoI) {}

  execute = async (request: AddOperatingSystemRequestDto): Promise<Response> => {
    const props = request;
    props.slug ||= textUtils.generateSlug(props.name);

    try {
      const operatingSystem = await this.operatingSystemRepo.createOperatingSystem(props);

      return right(Result.ok<any>(operatingSystem));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
