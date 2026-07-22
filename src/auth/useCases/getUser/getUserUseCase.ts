import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { AdminRepoI } from '../../adminRepo';
import { GetUserRequestDto } from './getUserRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class GetUserUseCase implements UseCase<GetUserRequestDto, Response> {
  constructor(private adminRepo: AdminRepoI) {}

  execute = async (request: GetUserRequestDto): Promise<Response> => {
    const { user } = request;
    try {
      const admin = await this.adminRepo.getAdmin(user.adminId);
      const found = !!admin;

      if (!found) {
        return left(new AppError.NotFound('Admin not found'));
      }

      return right(Result.ok<any>(admin));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
