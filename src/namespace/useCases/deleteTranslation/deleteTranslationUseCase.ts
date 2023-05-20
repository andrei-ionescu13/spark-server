import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { NamespaceRepoI } from '../../namespaceRepo';
import { DeleteTranslationRequestDto } from './deleteTranslationRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class DeleteTranslationUseCase implements UseCase<DeleteTranslationRequestDto, Response> {
  constructor(private namespaceRepo: NamespaceRepoI) {}

  execute = async (request: DeleteTranslationRequestDto): Promise<Response> => {
    const { namespaceId, key } = request;

    try {
      const namespace = await this.namespaceRepo.getNamespace(namespaceId, {
        'translations.key': key,
      });
      const found = !!namespace;

      if (!found) {
        return left(new AppError.NotFound('Namespace not found'));
      }

      await this.namespaceRepo.deleteNamespaceTranslation(namespaceId, key);

      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
