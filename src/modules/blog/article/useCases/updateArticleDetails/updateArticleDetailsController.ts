import { Request, Response } from 'express';
import * as z from 'zod';
import { Controller } from '../../../../../Controller';
import { zodRequestValidationError } from '../../../../../zodErrors';
import { UpdateArticleDetailsRequestDto } from './updateArticleDetailsRequestDto';
import { UpdateArticleDetailsUseCase } from './updateArticleDetailsUseCase';

export class UpdateArticleDetailsController extends Controller {
  constructor(private useCase: UpdateArticleDetailsUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const input = {
      ...req.body,
      articleId: req.params.articleId,
      file: req.file,
    };

    const schema = z.object({
      articleId: z.string(),
      description: z.string().min(24).max(120),
      slug: z.string().optional(),
      title: z.string().min(12).max(120),
      markdown: z.string().min(120).max(1024),
      file: z
        .object({
          originalname: z.string(),
          mimetype: z.enum(['image/png', 'image/jpeg', 'image/jpg', 'image/webp']),
          size: z.number().max(5_000_000),
          buffer: z.instanceof(Buffer),
        })
        .optional(),
      cover: z.string().optional(),
    });

    const result = schema.safeParse(input);

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto: UpdateArticleDetailsRequestDto = result.data;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const { error } = result;

        switch (error.constructor) {
          default:
            return this.fail(res, error);
        }
      }

      const article = result.value;
      const { description, title, slug, markdown, cover, updatedAt } = article;

      return this.ok(res, {
        description: description.value,
        title: title.value,
        slug: slug,
        markdown: markdown.value,
        cover,
        updatedAt,
      });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
