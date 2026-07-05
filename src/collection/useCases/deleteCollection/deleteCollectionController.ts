import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../AppError';
import { Controller } from '../../../Controller';
import { DeleteCollectionRequestDto } from './deleteCollectionRequestDto';
import { DeleteCollectionUseCase } from './deleteCollectionUseCase';

export class DeleteCollectionController extends Controller {
  constructor(private useCase: DeleteCollectionUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteCollectionRequestDto = {
      collectionId: req.params.collectionId,
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

      const collection = result.value;
      return this.ok(res, collection);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
