import * as z from 'zod';
import { zodDomainValidationError } from '../../../../zodErrors';
import { textUtils } from '../../../../utils/textUtils';
import { DomainValidationError } from '../../article/domain/status';
import { Result } from '../../../../result';
import { v7 as uuid7 } from 'uuid';

interface ArticleTagProps {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
}

interface CreateArticleTagProps extends Omit<ArticleTagProps, 'createdAt' | '_id' | 'updatedAt'> {}

export class ArticleTag {
  constructor(public readonly props: ArticleTagProps) {}

  public static create = (props: CreateArticleTagProps): Result<ArticleTag, Error> => {
    const schema = z.object({
      name: z.string().min(3),
      slug: z.string().optional(),
    });

    const result = schema.safeParse(props);

    if (result.error) {
      console.log(result.error);
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(
      new ArticleTag({
        ...props,
        slug: props.slug || textUtils.generateSlug(props.name),
        createdAt: new Date(),
        _id: uuid7(),
        updatedAt: null,
      }),
    );
  };

  public static reconstitute(props: ArticleTagProps) {
    return new ArticleTag(props);
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

    this.props.name = name;
    this.props.slug = slug;

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
