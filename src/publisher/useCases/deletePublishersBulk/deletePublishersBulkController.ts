import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { DeletePublishersBulkRequestDto } from './deletePublishersBulkRequestDto';
import { DeletePublishersBulkUseCase } from './deletePublishersBulkUseCase';
import { AppError } from '../../../AppError';
import { DeletePublisherErrors } from '../deletePublisher/deletePublisherUseCase';

export class DeletePublishersBulkController extends BaseController {
  constructor(private useCase: DeletePublishersBulkUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeletePublishersBulkRequestDto = { ids: req.body.ids };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case DeletePublisherErrors.PublisherInUse:
            return this.forbidden(res, error.getErrorValue().message);

          case AppError.NotFound:
            return this.notFound(res, error.getErrorValue().message);

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
