import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../result';
import { UseCase } from '../../../../useCase';
import { GetUserRequestDto } from '../../../users/useCases/getUser/getUserRequestDto';
import { AdminDto } from '../../adminMapper';
import { AdminQueriesRepoI } from '../../repo/admin/queries';
import { GetAdminRequestDto } from './getAdminRequestDto';

type Response = Result<AdminDto, UseCaseErrors.UnexpectedError>;

export class GetAdminUseCase implements UseCase<GetAdminRequestDto, Response> {
  constructor(private adminQueriesRepo: AdminQueriesRepoI) {}

  execute = async (request: GetAdminRequestDto): Promise<Response> => {
    const { user } = request;
    console.log(user);
    try {
      const admin = await this.adminQueriesRepo.getAdmin(user.adminId);
      const found = !!admin;

      if (!found) {
        return Result.fail(new UseCaseErrors.NotFound('Admin not found'));
      }

      return Result.ok(admin);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
