import { UseCaseErrors } from '../../../../appError';
import { DomainValidationError } from '../../../blog/article/domain/status';
import { Result } from '../../../../result';
import { UploaderService } from '../../../../services/uploaderService';
import { UseCase } from '../../../../useCase';
import { CreateDealProps, Deal } from '../../domain/deal';
import { DealCommandsRepoI } from '../../repo/commands';
import { CreateDealRequestDto } from './createDealRequestDto';
import { v7 as uuidv7 } from 'uuid';
import { Asset } from '../../../../assets';
import { DealDescription } from '../../domain/dealDescription';
import { Meta } from '../../../../meta';
import { DealTitle } from '../../domain/dealTitle';

type Response = Result<string, UseCaseErrors.UnexpectedError>;

export class CreateDealUseCase implements UseCase<CreateDealRequestDto, Response> {
  constructor(
    private dealCommandsRepo: DealCommandsRepoI,
    private uploaderService: UploaderService,
  ) {}

  execute = async (request: CreateDealRequestDto): Promise<Response> => {
    try {
      const uploadedFile = await this.uploaderService.uploadFile(request.coverFile);
      const coverOrError = Asset.create(uploadedFile);
      const descriptionOrError = DealDescription.create(request.description);
      const metaOrError = Meta.create(request.meta);
      const titleOrError = DealTitle.create(request.title);

      const combinedResult = Result.combine([
        coverOrError,
        descriptionOrError,
        metaOrError,
        titleOrError,
      ]);
      if (combinedResult.isErr())
        return Result.fail(new DomainValidationError(combinedResult.error.message));

      const [cover, description, meta, title] = combinedResult.value;

      const props: CreateDealProps = {
        cover,
        description,
        endDate: request.endDate,
        meta,
        products: request.products,
        slug: request.slug,
        startDate: request.startDate,
        title,
      };

      const dealOrError = Deal.create(props);
      if (dealOrError.isErr())
        return Result.fail(new DomainValidationError(dealOrError.error.message));

      const deal = dealOrError.value;
      await this.dealCommandsRepo.save(deal);

      return Result.ok(deal._id);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
