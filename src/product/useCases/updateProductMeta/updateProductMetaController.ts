import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../src/AppError';
import { Controller } from '../../../src/Controller';
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

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case UseCaseErrors.NotFound:
            return this.notFound(res, error.getErrorValue().message);

          default:
            return this.fail(res, error);
        }
      }

      const meta = result.value.getValue();

      return this.ok(res, meta);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
