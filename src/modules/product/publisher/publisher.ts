import z from 'zod';
import { textUtils } from '../../../../utils/textUtils';
import { Asset } from '../../../asset';
import { DomainValidationError } from '../../blog/article/status';
import { zodDomainValidationError } from '../../../zodErrors';
import { v7 as uuid7 } from 'uuid';
import { Result } from '../../../result';

interface PublisherProps {
  name: string;
  logo: Asset;
  createdAt: Date;
  updatedAt: Date | null;
  _id: string;
  slug: string;
}

interface PublisherCreateProps extends Omit<PublisherProps, 'slug' | 'updatedAt' | '_id'> {
  slug?: string;
}

export class Publisher {
  constructor(private props: PublisherProps) {}

  public static create(props: PublisherCreateProps): Result<Publisher, DomainValidationError> {
    const schema = z.object({
      _id: z.string(),
      createdAt: z.date(),
      updatedAt: z.date().nullable(),
      name: z.string().min(3),
      slug: z.string().optional(),
    });

    const result = schema.safeParse(props);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(
      new Publisher({
        ...props,
        slug: props.slug || textUtils.generateSlug(props.name),
        updatedAt: null,
        _id: uuid7(),
      }),
    );
  }

  public static reconstitute(props: PublisherProps) {
    return new Publisher(props);
  }

  public update(props: {
    name: string;
    logo?: Asset;
    slug: string;
  }): Result<undefined, DomainValidationError> {
    const schema = z.object({
      name: z.string().min(3),
      slug: z.string(),
    });

    const result = schema.safeParse(props);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    this.props.name = props.name;
    this.props.slug = props.slug;
    this.props.updatedAt = new Date();

    if (props.logo) {
      this.props.logo = props.logo;
    }

    return Result.ok();
  }

  get name() {
    return this.props.name;
  }

  get logo() {
    return this.props.logo;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get _id() {
    return this.props._id;
  }

  get slug() {
    return this.props.slug;
  }
}
