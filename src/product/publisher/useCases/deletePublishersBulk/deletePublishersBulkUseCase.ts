import { ProductRepoI } from '../../../../../product/productRepo';
import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UploaderService } from '../../../../services/uploaderService';
import { UseCase } from '../../../../use-case';
import { UseCaseError } from '../../../../UseCaseError';
import { PublisherCommandsRepoI } from '../../repo/commands';
import { PublisherQueriesRepoI } from '../../repo/queries';
import { DeletePublishersBulkRequestDto } from './deletePublishersBulkRequestDto';

export namespace DeletePublishersBulkErrors {
  export class PublisherIsUsed extends UseCaseError {
    constructor() {
      super('A Product is using this publisher');
    }
  }
}

type Response = Result<
  undefined,
  | DeletePublishersBulkErrors.PublisherIsUsed
  | UseCaseErrors.NotFound
  | UseCaseErrors.UnexpectedError
>;

export class DeletePublishersBulkUseCase
  implements UseCase<DeletePublishersBulkRequestDto, Response>
{
  constructor(
    private publisherCommandsRepo: PublisherCommandsRepoI,
    private publisherQueriesRepo: PublisherQueriesRepoI,
    private productRepo: ProductRepoI,
    private uploaderService: UploaderService,
  ) {}

  deletePublisher = async (
    publisherId: string,
  ): Promise<
    Result<undefined, UseCaseErrors.NotFound | DeletePublishersBulkErrors.PublisherIsUsed>
  > => {
    const publisher = await this.publisherQueriesRepo.getPublisher(publisherId);
    if (!publisher) {
      return Result.fail(new UseCaseErrors.NotFound('Publisher not found'));
    }

    //change this
    const product = await this.productRepo.getProductByDeveloper(publisherId);
    if (!product) {
      return Result.fail(new DeletePublishersBulkErrors.PublisherIsUsed());
    }

    await this.publisherCommandsRepo.deletePublisher(publisherId);
    await this.uploaderService.delete(publisher.logo.publicId);

    return Result.ok();
  };

  execute = async (request: DeletePublishersBulkRequestDto): Promise<Response> => {
    const { ids } = request;

    try {
      const responses = await Promise.all(ids.map((id) => this.deletePublisher(id)));
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
