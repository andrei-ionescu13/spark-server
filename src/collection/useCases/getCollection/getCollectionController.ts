import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../AppError';
import { Controller } from '../../../Controller';
import { GetCollectionRequestDto } from './getCollectionRequestDto';
import { GetCollectionUseCase } from './getCollectionUseCase';

export class GetCollectionController extends Controller {
  constructor(private useCase: GetCollectionUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: GetCollectionRequestDto = {
      collectionId: req.params.collectionId,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case UseCaseErrors.NotFound:
            return this.notFound(res, error.getErrorValue().message);

          default:
            return this.fail(res, error);
        }
      }

      const value = result.value.getValue();
      console.log(value);
      return this.ok(res, value);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
