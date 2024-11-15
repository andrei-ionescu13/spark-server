import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { NamespaceRepoI } from '../../namespaceRepo';
import { CreateTranslationRequestDto } from './createTranslationRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class CreateTranslationUseCase implements UseCase<CreateTranslationRequestDto, Response> {
  constructor(private namespaceRepo: NamespaceRepoI) { }

  execute = async (request: CreateTranslationRequestDto): Promise<Response> => {
    const { namespaceId, ...rest } = request;
    const props = rest;

    try {
      const namespace = await this.namespaceRepo.addNamespaceTranslation(namespaceId, props);
      return right(Result.ok<any>(namespace));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
