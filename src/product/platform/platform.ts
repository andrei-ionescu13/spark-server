import z from 'zod';
import { textUtils } from '../../../utils/textUtils';
import { Asset } from '../../blog/article/asset';
import { DomainValidationError } from '../../blog/article/status';
import { Result } from '../../Result';
import { zodDomainValidationError } from '../../zodErrors';

interface PlatformProps {
  name: string;
  logo: Asset;
  createdAt: Date;
  updatedAt: Date | null;
  _id: string;
  slug: string;
  url: string;
}

interface PlatformCreateProps extends Omit<PlatformProps, 'slug' | 'updatedAt'> {
  slug?: string;
  updatedAt?: Date | null;
}

export class Platform {
  constructor(private props: PlatformProps) {}

  public static create(props: PlatformCreateProps): Result<Platform, DomainValidationError> {
    const schema = z.object({
      _id: z.string(),
      createdAt: z.date(),
      updatedAt: z.date().optional(),
      name: z.string().min(3),
      slug: z.string().optional(),
      url: z.string().url(),
    });

    const result = schema.safeParse(props);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(
      new Platform({
        ...props,
        slug: props.slug || textUtils.generateSlug(props.name),
        updatedAt: props.updatedAt || null,
      }),
    );
  }

  public update(props: {
    name: string;
    url: string;
    logo?: Asset;
  }): Result<undefined, DomainValidationError> {
    const schema = z.object({
      name: z.string().min(3),
      url: z.string().url(),
    });

    const result = schema.safeParse(props);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    this.props.name = props.name;
    this.props.url = props.url;
    this.props.slug = textUtils.generateSlug(props.name);
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

  get url() {
    return this.props.url;
  }
}
