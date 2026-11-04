import { UseCaseErrors } from '../../../../appErrors';
import { Asset } from '../../../../assets';
import { Meta } from '../../../../meta';
import { Result } from '../../../../results';
import { UploaderService } from '../../../../services/uploaderService';
import { UseCase } from '../../../../useCase';
import { Deal, UpdateDealProps } from '../../domain/deal';
import { DealDescription } from '../../domain/dealDescription';
import { DealTitle } from '../../domain/dealTitle';
import { DealCommandsRepoI } from '../../repo/commands';
import { UpdateDealRequestDto } from './updateDealRequestDto';

type Response = Result<string, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class UpdateDealUseCase implements UseCase<UpdateDealRequestDto, Response> {
  constructor(
    private dealCommandsRepo: DealCommandsRepoI,
    private uploaderService: UploaderService,
  ) {}

  execute = async (request: UpdateDealRequestDto): Promise<Response> => {
    try {
      const deal = await this.dealCommandsRepo.getDeal(request.dealId);
      if (!deal) {
        return Result.fail(new UseCaseErrors.NotFound('Deal not found'));
      }

      const titleOrError = DealTitle.create(request.title);
      const descriptionOrError = DealDescription.create(request.description);
      const metaOrError = Meta.create(request.meta);
      const combinedResult = Result.combine([titleOrError, descriptionOrError, metaOrError]);
      if (combinedResult.isErr())
        return Result.fail(new UseCaseErrors.DomainValidation(combinedResult.error.message));

      const [title, description, meta] = combinedResult.value;

      const props: UpdateDealProps = {
        description,
        endDate: request.endDate,
        meta,
        products: request.products,
        slug: request.slug,
        startDate: request.startDate,
        title,
      };

      if (request.coverFile) {
        await this.uploaderService.delete(deal.cover.publicId);
        const uploadedCover = await this.uploaderService.uploadFile(request.coverFile);

        const coverOrError = Asset.create(uploadedCover);
        if (combinedResult.isErr())
          return Result.fail(new UseCaseErrors.DomainValidation(combinedResult.error.message));

        const cover = coverOrError.value;
        props.cover = cover;
      }

      deal.update(props);
      await this.dealCommandsRepo.save(deal);

      return Result.ok(deal._id);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
