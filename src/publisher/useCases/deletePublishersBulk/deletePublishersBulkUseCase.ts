import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCaseError } from '../../../UseCaseError';
import { ProductRepoI } from '../../../product/productRepo';
import { UploaderService } from '../../../services/uploaderService';
import { UseCase } from '../../../use-case';
import { PublisherRepoI } from '../../publisherRepo';
import { DeletePublishersBulkRequestDto } from './deletePublishersBulkRequestDto';

export namespace DeletePublishersBulkErrors {
  export class PublisherInUse extends Result<UseCaseError> {
    constructor() {
      super(false, { message: 'An Product is using this publisher' });
    }
  }
}

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class DeletePublishersBulkUseCase
  implements UseCase<DeletePublishersBulkRequestDto, Response>
{
  constructor(
    private publisherRepo: PublisherRepoI,
    private productRepo: ProductRepoI,
    private uploaderService: UploaderService,
  ) {}

  deletePublisher = async (publisherId: string): Promise<Result<UseCaseError | void>> => {
    const publisher = await this.publisherRepo.getPublisher(publisherId);
    const found = !!publisher;

    if (!found) {
      return new AppError.NotFound('Publisher not found');
    }

    const product = await this.productRepo.getProductByPublisher(publisherId);
    const productFound = !!product;

    if (productFound) {
      new DeletePublishersBulkErrors.PublisherInUse();
    }

    await this.publisherRepo.deletePublisher(publisherId);
    await this.uploaderService.delete(publisher.logo.public_id);

    return Result.ok();
  };
  execute = async (request: DeletePublishersBulkRequestDto): Promise<Response> => {
    const { ids } = request;

    try {
      const responses = await Promise.all(ids.map((id) => this.publisherRepo.deletePublisher(id)));

      const combinedResult = Result.combine(responses);

      if (combinedResult.isFailure) {
        return left(combinedResult);
      }

      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
