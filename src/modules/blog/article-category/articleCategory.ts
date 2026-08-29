import * as z from 'zod';
import { textUtils } from '../../../../utils/textUtils';
import { Result } from '../../../Result';
import { zodDomainValidationError } from '../../../zodErrors';
import { DomainValidationError } from '../article/status';

interface ArticleCategoryProps {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export class ArticleCategory {
  private constructor(private readonly props: ArticleCategoryProps) {}

  public static create(
    props: ArticleCategoryProps,
  ): Result<ArticleCategory, DomainValidationError> {
    const schema = z.object({
      name: z.string().min(3),
      slug: z.string().optional(),
    });

    const result = schema.safeParse(props.name);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(
      new ArticleCategory({
        ...props,
        slug: props.slug || textUtils.generateSlug(props.name),
      }),
    );
  }

  public updateNameAndSlug(name: string, slug: string): Result<undefined, DomainValidationError> {
    const schema = z.object({
      name: z.string().min(3),
      slug: z.string().min(3),
    });

    const result = schema.safeParse({ name, slug });

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok();
  }

  get _id() {
    return this.props._id;
  }

  get name() {
    return this.props.name;
  }

  get slug() {
    return this.props.slug;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
