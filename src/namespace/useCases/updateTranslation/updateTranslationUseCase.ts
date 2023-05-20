import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { NamespaceRepoI } from '../../namespaceRepo';
import { UpdateTranslationRequestDto } from './updateTranslationRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class UpdateTranslationUseCase implements UseCase<UpdateTranslationRequestDto, Response> {
  constructor(private namespaceRepo: NamespaceRepoI) {}

  execute = async (request: UpdateTranslationRequestDto): Promise<Response> => {
    const { namespaceId, key, ...rest } = request;
    const props = rest;

    try {
      const namespace = await this.namespaceRepo.getNamespace(namespaceId, {
        'translations.key': key,
      });
      const found = !!namespace;

      if (!found) {
        return left(new AppError.NotFound('Namespace not found'));
      }

      await this.namespaceRepo.updateNamespaceTranslation(namespaceId, key, props);

      return right(Result.ok<any>());
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
