import { basename } from 'node:path';
import { UseCaseErrors } from '../../../../../appErrors';
import { Result } from '../../../../../results';
import { UseCase } from '../../../../../useCase';
import { NamespaceCommandsRepoI } from '../../repo/commands';
import { DeleteTranslationRequestDto } from './deleteTranslationRequestDto';

type Response = Result<string, UseCaseErrors.NotFound | UseCaseErrors.UnexpectedError>;

export class DeleteTranslationUseCase implements UseCase<DeleteTranslationRequestDto, Response> {
  constructor(private namespaceCommandsRepo: NamespaceCommandsRepoI) {}

  execute = async (request: DeleteTranslationRequestDto): Promise<Response> => {
    const { namespaceId, key } = request;

    try {
      const namespace = await this.namespaceCommandsRepo.getNamespace(namespaceId, {
        'translations.key': key,
      });
      if (!namespace) {
        return Result.fail(new UseCaseErrors.NotFound('Namespace not found'));
      }

      const removeResult = namespace.removeTranslation(key);

      if (removeResult.isErr()) {
        return Result.fail(new UseCaseErrors.NotFound('Namespace not found'));
      }

      await this.namespaceCommandsRepo.save(namespace);
      return Result.ok(key);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
