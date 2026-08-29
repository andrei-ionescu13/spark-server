import { Request, Response } from 'express';
import { Controller } from '../../../../Controller';
import { UpdateProductDetailsRequestDto } from './updateProductDetailsRequestDto';
import { UpdateProductDetailsUseCase } from './updateProductDetailsUseCase';
import { UseCaseErrors } from '../../../../AppError';

export class UpdateProductDetailsController extends Controller {
  constructor(private useCase: UpdateProductDetailsUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;
    const dto: UpdateProductDetailsRequestDto = {
      productId: req.params.productId,
      title: body.title,
      minimumRequirements: body.minimumRequirements,
      recommendedRequirements: body.recommendedRequirements,
      markdown: body.markdown,
      price: body.price,
      genres: body.genres,
      developers: body.developers,
      features: body.features,
      languages: body.languages,
      releaseDate: body.releaseDate,
      publisher: body.publisher,
      platform: body.platform,
      link: body.link,
      os: body.os,
      slug: body.slug,
    };

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

      return this.ok(res);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
