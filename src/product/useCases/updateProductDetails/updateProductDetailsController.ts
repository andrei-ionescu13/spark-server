import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { UpdateProductDetailsRequestDto } from './updateProductDetailsRequestDto';
import { UpdateProductDetailsUseCase } from './updateProductDetailsUseCase';

export class UpdateProductDetailsController extends BaseController {
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
      initialPrice: body.initialPrice,
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

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(res, error);
        }
      }

      const value = result.value.getValue();

      return this.ok(res, value);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
