import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { textUtils } from '../../../utils/textUtils';
import { GenreRepoI } from '../../genreRepo';
import { AddGenreRequestDto } from './addGenreRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class AddGenreUseCase implements UseCase<AddGenreRequestDto, Response> {
  constructor(private genreRepo: GenreRepoI) {}

  execute = async (request: AddGenreRequestDto): Promise<Response> => {
    const props = request;
    props.slug ||= textUtils.generateSlug(props.name);

    try {
      const genre = await this.genreRepo.createGenre(props);

      return right(Result.ok<any>(genre));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
