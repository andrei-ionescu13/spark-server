import { Response } from 'express';
import * as z from 'zod';
import { Controller } from '../../../../../Controller';
import { zodRequestValidationError } from '../../../../../zodErrors';
import { CreateArticleRequestDto } from './createArticleRequestDto';
import { CreateArticleCategoryErrors, CreateArticleUseCase } from './createArticleUseCase';

export class CreateArticleController extends Controller {
  constructor(private useCase: CreateArticleUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: any, res: Response) => {
    const schema = z.object({
      tags: z.array(z.string().min(3)).min(1),
      description: z.string().min(24).max(120),
      meta: z.object({
        title: z.string().min(8).max(120),
        description: z.string().min(120).max(1024),
        keywords: z.array(z.string()).min(3),
      }),
      shouldPublish: z.coerce.boolean(),
      category: z.string(),
      slug: z.string().optional(),
      title: z.string().min(12).max(120),
      markdown: z.string().min(120).max(1024),
      coverFile: z.object({
        originalname: z.string(),
        mimetype: z.enum(['image/png', 'image/jpeg', 'image/jpg', 'image/webp']),
        size: z.number().max(5_000_000),
        buffer: z.instanceof(Buffer),
      }),
    });

    const result = schema.safeParse({ ...req.body, coverFile: req.file });

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto: CreateArticleRequestDto = result.data;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const { error } = result;

        switch (error.constructor) {
          case CreateArticleCategoryErrors.TitleNotAvailableError:
            return this.forbidden(res, error.message);

          case CreateArticleCategoryErrors.SlugNotAvailableError:
            return this.forbidden(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const articleId = result._value;

      return this.ok(res, { id: articleId });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
