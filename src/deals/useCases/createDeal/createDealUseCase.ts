import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UploaderService } from '../../../services/uploaderService';
import { UseCase } from '../../../use-case';
import { DealRepoI } from '../../dealRepo';
import { CreateDealRequestDto } from './createDealRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class CreateDealUseCase implements UseCase<CreateDealRequestDto, Response> {
  constructor(private dealRepo: DealRepoI, private uploaderService: UploaderService) {}

  execute = async (request: CreateDealRequestDto): Promise<Response> => {
    const { coverFile, ...rest } = request;
    const props: any = rest;

    try {
      const uploadedFile = await this.uploaderService.uploadFile(coverFile);

      props.cover = uploadedFile;
      props.endDate = !!props.endDate ? props.endDate : null;

      const deal = await this.dealRepo.createDeal(props);

      return right(Result.ok<any>(deal));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
