import { UseCaseErrors } from '../../../../AppError';
import { DomainValidationError } from '../../../blog/article/status';
import { Result } from '../../../../Result';
import { UploaderService } from '../../../../services/uploaderService';
import { UseCase } from '../../../../useCase';
import { Deal } from '../../deal';
import { DealCommandsRepoI } from '../../repo/commands';
import { CreateDealRequestDto } from './createDealRequestDto';
import { v7 as uuidv7 } from 'uuid';

type Response = Result<string, UseCaseErrors.UnexpectedError>;

export class CreateDealUseCase implements UseCase<CreateDealRequestDto, Response> {
  constructor(
    private dealCommandsRepo: DealCommandsRepoI,
    private uploaderService: UploaderService,
  ) {}

  execute = async (request: CreateDealRequestDto): Promise<Response> => {
    const { coverFile, ...rest } = request;
    const props: any = rest;

    try {
      const uploadedFile = await this.uploaderService.uploadFile(coverFile);

      props.cover = uploadedFile;
      props.endDate = !!props.endDate ? props.endDate : null;
      props._id = uuidv7();

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
