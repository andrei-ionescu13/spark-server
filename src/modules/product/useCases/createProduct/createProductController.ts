import { Request, Response } from 'express';
import * as z from 'zod';
import { UseCaseErrors } from '../../../../AppError';
import { Controller } from '../../../../Controller';
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
      shouldPublish: body.shouldPublish,
      markdown: body.markdown,
      price: body.price,
      genres: body.genres,
      selectedImages: body.selectedImages,
      videos: body.videos,
      developers: body.developers,
      features: body.features,
      releaseDate: body.releaseDate,
      publisher: body.publisher,
      platform: body.platform,
      link: body.link,
      os: body.os,
      slug: body.slug,
      metaTitle: body.meta,
      //@ts-ignore
      coverFile: req.files.cover[0] as Express.Multer.File,
      //@ts-ignore
      imageFiles: req.files['images[]'] as Express.Multer.File[],
      //@ts-ignore
      keysFile: req.files.keys[0] as Express.Multer.File,
    };

    const schema = z.object({
      meta: z.object({
        title: z.string().min(8).max(120),
        description: z.string().min(120).max(1024),
        keywords: z.array(z.string()).min(3),
      }),
      coverFile: z.object({
        originalname: z.string(),
        mimetype: z.enum(['image/png', 'image/jpeg', 'image/jpg', 'image/webp']),
        size: z.number().max(5_000_000),
        buffer: z.instanceof(Buffer),
      }),
      imageFiles: z.array(
        z.object({
          originalname: z.string(),
          mimetype: z.enum(['image/png', 'image/jpeg', 'image/jpg', 'image/webp']),
          size: z.number().max(5_000_000),
          buffer: z.instanceof(Buffer),
        }),
      ),
      selectedImages: z.array(
        z.object({
          originalname: z.string(),
          mimetype: z.enum(['image/png', 'image/jpeg', 'image/jpg', 'image/webp']),
          size: z.number().max(5_000_000),
          buffer: z.instanceof(Buffer),
        }),
      ),
      keysFile: z.object({
        originalname: z.string(),
        mimetype: z.enum(['text/plain']),
        size: z.number().max(5_000_000),
        buffer: z.instanceof(Buffer),
      }),
      minimumRequirements: z.string().min(1).max(1024),
      recommendedRequirements: z.string().min(1).max(1024),
      title: z.string().min(1),
      link: z.url().optional(),
      markdown: z.string().min(255).max(2048),
      price: z.number().positive(),
      videos: z.array(z.url()).min(1),
      genres: z.array(z.uuidv7()).min(1),
      releaseDate: z.date(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      publisher: z.uuidv7(),
      platform: z.uuidv7(),
      developers: z.array(z.uuidv7()).min(1),
      features: z.array(z.uuidv7()).min(1),
      os: z.uuidv7(),
      slug: z.string().min(1).optional(),
      keys: z.array(z.uuidv7()),
      reviews: z.array(z.uuidv7()),
      discount: z.uuidv7(),
      shouldPublish: z.coerce.boolean(),
    });

    const result = schema.safeParse(input);

    if (result.error) {
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

          case CreateProductErrors.KeyForPlatformExists:
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
