import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../AppError';
import { Controller } from '../../../Controller';
import { DeactivateCollectionRequestDto } from './deactivateCollectionRequestDto';
import { DeactivateCollectionUseCase } from './deactivateCollectionUseCase';

export class DeactivateCollectionController extends Controller {
  constructor(private useCase: DeactivateCollectionUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeactivateCollectionRequestDto = {
      collectionId: req.params.collectionId,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          case UseCaseErrors.DomainValidation:
            return this.conflict(res, error.message);

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
