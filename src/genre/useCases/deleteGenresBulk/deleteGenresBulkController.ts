import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { DeleteGenresBulkRequestDto } from './deleteGenresBulkRequestDto';
import { DeleteGenresBulkUseCase } from './deleteGenresBulkUseCase';

export class DeleteGenresBulkController extends BaseController {
  constructor(private useCase: DeleteGenresBulkUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteGenresBulkRequestDto = { ids: req.body.ids };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(res, error);
        }
      }

      return this.ok(res, result);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
