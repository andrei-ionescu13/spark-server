import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../../AppError';
import { Controller } from '../../../../../Controller';
import { DeletePublisherRequestDto } from './deletePublisherRequestDto';
import { DeletePublisherErrors, DeletePublisherUseCase } from './deletePublisherUseCase';

export class DeletePublisherController extends Controller {
  constructor(private useCase: DeletePublisherUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeletePublisherRequestDto = {
      publisherId: req.params.publisherId,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case DeletePublisherErrors.PublisherIsUsed:
            return this.forbidden(res, error.message);

          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      return this.noContent(res);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
