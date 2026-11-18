import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../appError';
import { Controller } from '../../../../controller';
import { UpdateProductMetaUseCase } from './updateProductMetaUseCase';
import * as z from 'zod';
import { toArray } from '../../../../utils/toArray';

const schema = z.object({
  metaDescription: z.string(),
  metaKeywords: z.preprocess(toArray, z.array(z.string()).min(1)),
  metaTitle: z.string(),
  productId: z.uuid(),
});

export type UpdateProductMetaRequestDto = z.infer<typeof schema>;

export class UpdateProductMetaController extends Controller {
  constructor(private useCase: UpdateProductMetaUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;
    const result = schema.safeParse({
      metaDescription: body.metaDescription,
      metaKeywords: body.metaKeywords,
      metaTitle: body.metaTitle,
      productId: req.params.productId,
    });

    if (result.error) {
      console.log(result.error);
      return this.forbidden(res, result.error.message);
    }

    const dto = result.data;

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

      const id = result.value;
      return this.ok(res, id);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
