import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UploaderService } from '../../../../services/uploaderService';
import { UseCase } from '../../../../use-case';
import { UseCaseError } from '../../../../UseCaseError';
import { ProductRepoI } from '../../../productRepo';
import { PublisherCommandsRepoI } from '../../repo/commands';
import { PublisherQueriesRepoI } from '../../repo/queries';
import { DeletePublisherRequestDto } from './deletePublisherRequestDto';

export namespace DeletePublisherErrors {
  export class PublisherIsUsed extends UseCaseError {
    constructor() {
      super('A Product is using this publisher');
    }
  }
}

type Response = Result<
  undefined,
  DeletePublisherErrors.PublisherIsUsed | UseCaseErrors.UnexpectedError
>;

export class DeletePublisherUseCase implements UseCase<DeletePublisherRequestDto, Response> {
  constructor(
    private publisherCommandsRepo: PublisherCommandsRepoI,
    private publisherQueriesRepo: PublisherQueriesRepoI,
    private productRepo: ProductRepoI,
    private uploaderService: UploaderService,
  ) {}

  execute = async (request: DeletePublisherRequestDto): Promise<Response> => {
    const { publisherId } = request;

    try {
      const publisher = await this.publisherQueriesRepo.getPublisher(publisherId);
      if (!publisher) {
        return Result.fail(new UseCaseErrors.NotFound('Publisher not found'));
      }

      //change this
      const product = await this.productRepo.getProductByDeveloper(publisherId);
      if (!product) {
        return Result.fail(new DeletePublisherErrors.PublisherIsUsed());
      }

      await this.publisherCommandsRepo.deletePublisher(publisherId);
      await this.uploaderService.delete(publisher.logo.publicId);

      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
