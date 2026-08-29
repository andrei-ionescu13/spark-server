import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../AppError';
import { Controller } from '../../../../Controller';
import { UpdateProductMetaRequestDto } from './updateProductMetaRequestDto';
import { UpdateProductMetaUseCase } from './updateProductMetaUseCase';

export class UpdateProductMetaController extends Controller {
  constructor(private useCase: UpdateProductMetaUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;
    const dto: UpdateProductMetaRequestDto = {
      metaDescription: body.metaDescription,
      metaKeywords: body.metaKeywords,
      metaTitle: body.metaTitle,
      productId: req.params.productId,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          case UseCaseErrors.DomainValidation:
            return this.forbidden(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      return this.ok(res);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
