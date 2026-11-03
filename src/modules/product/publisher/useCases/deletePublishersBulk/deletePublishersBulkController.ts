import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../../AppError';
import { Controller } from '../../../../../Controller';
import { DeletePublisherErrors } from '../deletePublisher/deletePublisherUseCase';
import { DeletePublishersBulkRequestDto } from './deletePublishersBulkRequestDto';
import { DeletePublishersBulkUseCase } from './deletePublishersBulkUseCase';

export class DeletePublishersBulkController extends Controller {
  constructor(private useCase: DeletePublishersBulkUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeletePublishersBulkRequestDto = { ids: req.body.ids };

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
