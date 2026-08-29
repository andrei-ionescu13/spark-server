import { UseCaseErrors } from '../../../../AppError';
import { Asset } from '../../../blog/article/asset';
import { Result } from '../../../../Result';
import { UploaderService } from '../../../../services/uploaderService';
import { UseCase } from '../../../../useCase';
import { Deal } from '../../deal';
import { DealTitle } from '../../dealTitle';
import { DealCommandsRepoI } from '../../repo/commands';
import { UpdateDealRequestDto } from './updateDealRequestDto';

type Response = Result<Deal, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class UpdateDealUseCase implements UseCase<UpdateDealRequestDto, Response> {
  constructor(
    private dealCommandsRepo: DealCommandsRepoI,
    private uploaderService: UploaderService,
  ) {}

  execute = async (request: UpdateDealRequestDto): Promise<Response> => {
    const { dealId, coverFile, ...rest } = request;
    const props: any = rest;

    try {
      const dealOrError = await this.dealCommandsRepo.getDeal(dealId);
      if (dealOrError.isErr())
        return Result.fail(new UseCaseErrors.DomainValidation(dealOrError.error.message));

      const deal = dealOrError.value;
      if (!deal) {
        return Result.fail(new UseCaseErrors.NotFound('Deal not found'));
      }

      if (coverFile) {
        await this.uploaderService.delete(deal.cover.publicId);
        const uploadedCover = await this.uploaderService.uploadFile(coverFile);
        props.cover = uploadedCover;
      }

      props.endDate = !!props.endDate ? props.endDate : null;
      const coverOrError = Asset.create(props.cover);
      const titleOrError = DealTitle.create(props.title);
      const descriptionOrError = Deal.create(props.description);
      const result = Result.combine([coverOrError, titleOrError, descriptionOrError]);
      if (result.isErr())
        return Result.fail(new UseCaseErrors.DomainValidation(result.error.message));

      props.cover = coverOrError.value;
      props.title = titleOrError.value;
      props.description = descriptionOrError.value;
      deal.update(props);

      await this.dealCommandsRepo.save(deal);

      return Result.ok(deal);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
