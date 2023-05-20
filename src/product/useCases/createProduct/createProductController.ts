import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { CreateProductRequestDto } from './createProductRequestDto';
import { CreateProductUseCase } from './createProductUseCase';

export class CreateProductController extends BaseController {
  constructor(private useCase: CreateProductUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;
    const dto: CreateProductRequestDto = {
      title: body.title,
      minimumRequirements: body.minimumRequirements,
      recommendedRequirements: body.recommendedRequirements,
      shouldPublish: body.shouldPublish,
      markdown: body.markdown,
      price: body.price,
      initialPrice: body.initialPrice,
      genres: body.genres,
      selectedImages: body.selectedImages,
      videos: body.videos,
      developers: body.developers,
      features: body.features,
      languages: body.languages,
      releaseDate: body.releaseDate,
      publisher: body.publisher,
      platform: body.platform,
      link: body.link,
      os: body.os,
      slug: body.slug,
      metaTitle: body.metaTitle,
      metaDescription: body.metaDescription,
      metaKeywords: body.metaKeywords,
      //@ts-ignore
      coverFile: req.files.cover[0] as Express.Multer.File,
      //@ts-ignore
      imageFiles: req.files['images[]'] as Express.Multer.File[],
      //@ts-ignore
      keysFile: req.files.keys[0] as Express.Multer.File,
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

      const id = result.value.getValue();

      return this.ok(res, { id });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
