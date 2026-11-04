import { UseCaseErrors } from '../../../../../appErrors';
import { Result } from '../../../../../results';
import { UseCase } from '../../../../../useCase';
import { Namespace } from '../../domain/namespace';
import { NamespaceCommandsRepoI } from '../../repo/commands';
import { UpdateNamespaceRequestDto } from './updateNamespaceRequestDto';

type Response = Result<string, UseCaseErrors.NotFound | UseCaseErrors.UnexpectedError>;

export class UpdateNamespaceUseCase implements UseCase<UpdateNamespaceRequestDto, Response> {
  constructor(private namespaceCommandsRepo: NamespaceCommandsRepoI) {}

  execute = async (request: UpdateNamespaceRequestDto): Promise<Response> => {
    const { namespaceId, name } = request;

    try {
      const namespace = await this.namespaceCommandsRepo.getNamespace(namespaceId);
      if (!namespace) {
        return Result.fail(new UseCaseErrors.NotFound('Namespace not found'));
      }

      namespace.updateName(name);

      this.namespaceCommandsRepo.save(namespace);
      return Result.ok(namespace.name);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
