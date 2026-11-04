import { Request, Response } from 'express';
import { GetAdminRequestDto } from './getAdminRequestDto';
import { GetAdminUseCase } from './getAdminUseCase';
import { UseCaseErrors } from '../../../../appErrors';
import { Controller } from '../../../../controller';
import { DecodedRequest } from '../../../../decodedRequests';

export class GetAdminController extends Controller {
  constructor(private useCase: GetAdminUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: DecodedRequest, res: Response) => {
    const dto: GetAdminRequestDto = {
      user: req.user,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          default:
            return this.fail(res, error);
        }
      }
      const user = result.value;
      return this.ok(res, user);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
