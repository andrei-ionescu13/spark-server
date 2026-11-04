import { Request, Response } from 'express';
import * as z from 'zod';
import { UseCaseErrors } from '../../../../appErrors';
import { Controller } from '../../../../controller';
import { CreateProductRequestDto } from './createProductRequestDto';
import { CreateProductErrors, CreateProductUseCase } from './createProductUseCase';

export class CreateProductController extends Controller {
  constructor(private useCase: CreateProductUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;

    const input = {
      title: body.title,
      minimumRequirements: body.minimumRequirements,
      recommendedRequirements: body.recommendedRequirements,
      markdown: body.markdown,
      price: body.price,
      genres: body.genres,
      images: body.images,
      videos: body.videos,
      developers: body.developers,
      features: body.features,
      releaseDate: body.releaseDate,
      publisher: body.publisher,
      platform: body.platform,
      link: body.link,
      os: body.os,
      slug: body.slug,
      meta: {
        description: body.meta.description,
        keywords: body.meta.keywords,
        title: body.meta.title,
      },
      //@ts-ignore
      coverFile: req.files.cover[0] as Express.Multer.File,
      //@ts-ignore
      allImageFiles: req.files['allImages[]'] as Express.Multer.File[],
    };

    const schema = z.object({
      meta: z.object({
        title: z.string().min(1).max(120),
        description: z.string().min(1).max(1024),
        keywords: z.array(z.string()).min(1),
      }),
      coverFile: z.object({
        originalname: z.string(),
        mimetype: z.enum(['image/png', 'image/jpeg', 'image/jpg', 'image/webp']),
        size: z.number().max(5_000_000_000),
        buffer: z.instanceof(Buffer),
      }),
      allImageFiles: z.array(
        z.object({
          originalname: z.string(),
          mimetype: z.enum(['image/png', 'image/jpeg', 'image/jpg', 'image/webp']),
          size: z.number().max(5_000_000_000),
          buffer: z.instanceof(Buffer),
        }),
      ),
      images: z.array(z.string()),
      minimumRequirements: z.string().min(1).max(1024),
      recommendedRequirements: z.string().min(1).max(1024),
      title: z.string().min(1),
      link: z.url().optional(),
      markdown: z.string().min(8).max(2048),
      price: z.coerce.number().positive(),
      videos: z.array(z.url()).min(1),
      genres: z.array(z.uuidv7()).min(1),
      releaseDate: z.coerce.date(),
      publisher: z.uuidv7(),
      platform: z.uuidv7(),
      developers: z.array(z.uuidv7()).min(1),
      features: z.array(z.uuidv7()).min(1),
      os: z.array(z.uuidv7()).min(1),
      slug: z.string().min(1).optional(),
    });

    const result = schema.safeParse(input);

    if (result.error) {
      console.log(result.error);
      return this.forbidden(res, result.error.message);
    }

    const dto: CreateProductRequestDto = result.data;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case CreateProductErrors.FieldsNotAvailable:
            return this.conflict(res, error.message);

          case CreateProductErrors.SlugNotAvailableError:
            return this.conflict(res, error.message);

          case CreateProductErrors.TitleNotAvailableError:
            return this.conflict(res, error.message);

          case UseCaseErrors.DomainValidation:
            return this.conflict(res, error.message);

          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const id = result.value;
      return this.ok(res, { id });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
