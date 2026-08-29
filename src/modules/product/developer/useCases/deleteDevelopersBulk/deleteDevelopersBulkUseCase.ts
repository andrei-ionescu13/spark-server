import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UploaderService } from '../../../../../services/uploaderService';
import { UseCase } from '../../../../../useCase';
import { UseCaseError } from '../../../../../UseCaseError';
import { ProductQueriesRepoI } from '../../../repo/queries';
import { DeveloperCommandsRepoI } from '../../repo/commands';
import { DeveloperQueriesRepoI } from '../../repo/queries';
import { DeleteDevelopersBulkRequestDto } from './deleteDevelopersBulkRequestDto';

export namespace DeleteDevelopersBulkErrors {
  export class DeveloperIsUsed extends UseCaseError {
    constructor() {
      super('A Product is using this developer');
    }
  }
}

type Response = Result<
  undefined,
  | DeleteDevelopersBulkErrors.DeveloperIsUsed
  | UseCaseErrors.NotFound
  | UseCaseErrors.UnexpectedError
>;

export class DeleteDevelopersBulkUseCase
  implements UseCase<DeleteDevelopersBulkRequestDto, Response>
{
  constructor(
    private developerCommandsRepo: DeveloperCommandsRepoI,
    private developerQueriesRepo: DeveloperQueriesRepoI,
    private productQueriesRepo: ProductQueriesRepoI,
    private uploaderService: UploaderService,
  ) {}

  deleteDeveloper = async (
    developerId: string,
  ): Promise<
    Result<undefined, UseCaseErrors.NotFound | DeleteDevelopersBulkErrors.DeveloperIsUsed>
  > => {
    const developer = await this.developerQueriesRepo.getDeveloper(developerId);
    if (!developer) {
      return Result.fail(new UseCaseErrors.NotFound('Developer not found'));
    }

    const product = await this.productQueriesRepo.getProductByGenre(developerId);
    if (!product) {
      return Result.fail(new DeleteDevelopersBulkErrors.DeveloperIsUsed());
    }

    await this.developerCommandsRepo.deleteDeveloper(developerId);
    await this.uploaderService.delete(developer.logo.publicId);

    return Result.ok();
  };

  execute = async (request: DeleteDevelopersBulkRequestDto): Promise<Response> => {
    const { ids } = request;

    try {
      const responses = await Promise.all(ids.map((id) => this.deleteDeveloper(id)));
      const combinedResult = Result.combine(responses);

      if (combinedResult.isErr()) {
        return Result.fail(combinedResult.error);
      }

      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
