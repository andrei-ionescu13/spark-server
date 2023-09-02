import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCaseError } from '../../../UseCaseError';
import { ProductRepoI } from '../../../product/productRepo';
import { UploaderService } from '../../../services/uploaderService';
import { UseCase } from '../../../use-case';
import { PublisherRepoI } from '../../publisherRepo';
import { DeletePublisherRequestDto } from './deletePublisherRequestDto';

export namespace DeletePublisherErrors {
  export class PublisherInUse extends Result<UseCaseError> {
    constructor() {
      super(false, { message: 'An Product is using this publisher' });
    }
  }
}

type Response = Either<
  DeletePublisherErrors.PublisherInUse | AppError.UnexpectedError,
  Result<any>
>;

export class DeletePublisherUseCase implements UseCase<DeletePublisherRequestDto, Response> {
  constructor(
    private publisherRepo: PublisherRepoI,
    private productRepo: ProductRepoI,
    private uploaderService: UploaderService,
  ) {}

  execute = async (request: DeletePublisherRequestDto): Promise<Response> => {
    const { publisherId } = request;

    try {
      const publisher = await this.publisherRepo.getPublisher(publisherId);
      const found = !!publisher;

      if (!found) {
        return left(new AppError.NotFound('Publisher not found'));
      }

      const product = await this.productRepo.getProductByPublisher(publisherId);
      const productFound = !!product;

      if (productFound) {
        return left(new DeletePublisherErrors.PublisherInUse());
      }

      await this.publisherRepo.deletePublisher(publisherId);
      await this.uploaderService.delete(publisher.logo.public_id);

      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
