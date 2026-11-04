import { Request, Response } from 'express';
import { Controller } from '../../../../controller';
import { UpdateProductDetailsRequestDto } from './updateProductDetailsRequestDto';
import { UpdateProductDetailsUseCase } from './updateProductDetailsUseCase';
import { UseCaseErrors } from '../../../../appError';
import * as z from 'zod';

export class UpdateProductDetailsController extends Controller {
  constructor(private useCase: UpdateProductDetailsUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;

    const input = {
      productId: req.params.productId,
      title: body.title,
      minimumRequirements: body.minimumRequirements,
      recommendedRequirements: body.recommendedRequirements,
      markdown: body.markdown,
      price: body.price,
      genres: body.genres,
      developers: body.developers,
      features: body.features,
      releaseDate: body.releaseDate,
      publisher: body.publisher,
      platform: body.platform,
      link: body.link,
      os: body.os,
      slug: body.slug,
    };

    const schema = z.object({
      productId: z.uuidv7(),
      minimumRequirements: z.string().min(1).max(1024),
      recommendedRequirements: z.string().min(1).max(1024),
      title: z.string().min(1),
      link: z.url().optional(),
      markdown: z.string().min(8).max(2048),
      price: z.coerce.number().positive(),
      genres: z.array(z.uuidv7()).min(1),
      releaseDate: z.coerce.date(),
      publisher: z.uuidv7(),
      platform: z.uuidv7(),
      developers: z.array(z.uuidv7()).min(1),
      features: z.array(z.uuidv7()).min(1),
      os: z.array(z.uuidv7()).min(1),
      slug: z.string().min(1),
    });

    const result = schema.safeParse(input);

    if (result.error) {
      console.log(result.error);
      return this.forbidden(res, result.error.message);
    }

    const dto: UpdateProductDetailsRequestDto = result.data;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case UseCaseErrors.DomainValidation:
            return this.fail(res, error.message);

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
