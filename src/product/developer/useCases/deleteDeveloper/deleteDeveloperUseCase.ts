import { ProductRepoI } from '../../../../../product/productRepo';
import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UploaderService } from '../../../../services/uploaderService';
import { UseCase } from '../../../../use-case';
import { UseCaseError } from '../../../../UseCaseError';
import { DeveloperCommandsRepoI } from '../../repo/commands';
import { DeveloperQueriesRepoI } from '../../repo/queries';
import { DeleteDeveloperRequestDto } from './deleteDeveloperRequestDto';

export namespace DeleteDeveloperErrors {
  export class DeveloperIsUsed extends UseCaseError {
    constructor() {
      super('A Product is using this developer');
    }
  }
}

type Response = Result<
  undefined,
  DeleteDeveloperErrors.DeveloperIsUsed | UseCaseErrors.UnexpectedError
>;

export class DeleteDeveloperUseCase implements UseCase<DeleteDeveloperRequestDto, Response> {
  constructor(
    private developerCommandsRepo: DeveloperCommandsRepoI,
    private developerQueriesRepo: DeveloperQueriesRepoI,
    private productRepo: ProductRepoI,
    private uploaderService: UploaderService,
  ) {}

  execute = async (request: DeleteDeveloperRequestDto): Promise<Response> => {
    const { developerId } = request;

    try {
      const developer = await this.developerQueriesRepo.getDeveloper(developerId);
      if (!developer) {
        return Result.fail(new UseCaseErrors.NotFound('Developer not found'));
      }

      //change this
      const product = await this.productRepo.getProductByDeveloper(developerId);
      if (!product) {
        return Result.fail(new DeleteDeveloperErrors.DeveloperIsUsed());
      }

      await this.developerCommandsRepo.deleteDeveloper(developerId);
      await this.uploaderService.delete(developer.logo.publicId);

      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
