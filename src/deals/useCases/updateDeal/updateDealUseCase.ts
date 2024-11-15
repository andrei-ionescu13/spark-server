import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UploaderService } from '../../../services/uploaderService';
import { UseCase } from '../../../use-case';
import { DealRepoI } from '../../dealRepo';
import { UpdateDealRequestDto } from './updateDealRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class UpdateDealUseCase implements UseCase<UpdateDealRequestDto, Response> {
  constructor(private dealRepo: DealRepoI, private uploaderService: UploaderService) {}

  execute = async (request: UpdateDealRequestDto): Promise<Response> => {
    const { dealId, coverFile, ...rest } = request;
    const props: any = rest;

    try {
      const deal = await this.dealRepo.getDeal(dealId);
      const found = !!deal;

      if (!found) {
        return left(new AppError.NotFound('Deal not found'));
      }

      if (coverFile) {
        await this.uploaderService.delete(deal.cover.public_id);
        const uploadedCover = await this.uploaderService.uploadFile(coverFile);
        props.cover = uploadedCover;
      }

      props.endDate = !!props.endDate ? props.endDate : null;

      const updatedDeal = await this.dealRepo.updateDeal(dealId, props);

      return right(Result.ok(updatedDeal));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
