import { UseCaseErrors } from '../../../../appError';
import { Result } from '../../../../result';
import { UseCase } from '../../../../useCase';
import { AdminDto } from '../../adminMapper';
import { AdminQueriesRepoI } from '../../repo/admin/queries';
import { GetAdminRequestDto } from './getAdminController';

type Response = Result<AdminDto, UseCaseErrors.UnexpectedError>;

export class GetAdminUseCase implements UseCase<GetAdminRequestDto, Response> {
  constructor(private adminQueriesRepo: AdminQueriesRepoI) {}

  execute = async (request: GetAdminRequestDto): Promise<Response> => {
    const { user } = request;

    try {
      const admin = await this.adminQueriesRepo.getAdmin(user);
      if (!admin) {
        return Result.fail(new UseCaseErrors.NotFound('Admin not found'));
      }

      return Result.ok(admin);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
