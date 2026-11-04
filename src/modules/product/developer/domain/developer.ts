import z from 'zod';
import { textUtils } from '../../../../utils/textUtils';
import { DomainValidationError } from '../../../blog/article/domain/status';
import { zodDomainValidationError } from '../../../../zodErrors';
import { Result } from '../../../../results';
import { v7 as uuid7 } from 'uuid';
import { Asset } from '../../../../assets';

interface DeveloperProps {
  name: string;
  logo: Asset;
  createdAt: Date;
  updatedAt: Date | null;
  _id: string;
  slug: string;
}

interface DeveloperCreateProps
  extends Omit<DeveloperProps, 'slug' | 'updatedAt' | '_id' | 'createdAt'> {
  slug?: string;
}

export class Developer {
  constructor(private props: DeveloperProps) {}

  public static create(props: DeveloperCreateProps): Result<Developer, DomainValidationError> {
    const schema = z.object({
      name: z.string().min(1),
      slug: z.string().optional(),
    });

    const result = schema.safeParse(props);

    if (result.error) {
      console.log(result.error);
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(
      new Developer({
        ...props,
        slug: props.slug || textUtils.generateSlug(props.name),
        updatedAt: null,
        _id: uuid7(),
        createdAt: new Date(),
      }),
    );
  }

  public static reconstitute(props: DeveloperProps) {
    return new Developer(props);
  }

  public update(props: {
    name: string;
    slug: string;
    logo?: Asset;
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
