import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../../AppError';
import { Controller } from '../../../../../Controller';
import { GetDeveloperRequestDto } from './getDeveloperRequestDto';
import { GetDeveloperUseCase } from './getDeveloperUseCase';

export class GetDeveloperController extends Controller {
  constructor(private useCase: GetDeveloperUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: GetDeveloperRequestDto = { developerId: req.params.developerId };

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

      const developer = result.value;
      return this.ok(res, developer);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
