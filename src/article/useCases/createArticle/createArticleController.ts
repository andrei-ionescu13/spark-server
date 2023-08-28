import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { CreateArticleCategoryErrors, CreateArticleUseCase } from './createArticleUseCase';
import { CreateArticleRequestDto } from './createArticleRequestDto';

export class CreateArticleController extends BaseController {
  constructor(private useCase: CreateArticleUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: any, res: Response) => {
    const body = req.body;
    const dto: CreateArticleRequestDto = {
      tags: body.tags,
      description: body.description,
      meta: {
        description: body.meta.description,
        keywords: body.meta.keywords,
        title: body.meta.title,
      },
      shouldPublish: JSON.parse(body.shouldPublish),
      category: body.category,
      slug: body.slug,
      title: body.title,
      markdown: body.markdown,
      coverFile: req.file,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case CreateArticleCategoryErrors.TitleNotAvailableError:
            return this.forbidden(res, error.getErrorValue().message);

          case CreateArticleCategoryErrors.SlugNotAvailableError:
            return this.forbidden(res, error.getErrorValue().message);

          default:
            return this.fail(res, error);
        }
      }

      const articleId = result.value.getValue();

      return this.ok(res, { id: articleId });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
