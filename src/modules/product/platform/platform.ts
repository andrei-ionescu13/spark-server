import z from 'zod';
import { textUtils } from '../../../../utils/textUtils';
import { Asset } from '../../../asset';
import { DomainValidationError } from '../../blog/article/status';
import { zodDomainValidationError } from '../../../zodErrors';
import { Result } from '../../../result';
import { v7 as uuidv7 } from 'uuid';

interface PlatformProps {
  name: string;
  logo: Asset;
  createdAt: Date;
  updatedAt: Date | null;
  _id: string;
  url: string;
}

interface PlatformCreateProps extends Omit<PlatformProps, '_id'> {}

export class Platform {
  constructor(private props: PlatformProps) {}

  public static create(props: PlatformCreateProps): Result<Platform, DomainValidationError> {
    const schema = z.object({
      _id: z.string(),
      createdAt: z.date(),
      updatedAt: z.date().nullable(),
      name: z.string().min(3),
      url: z.string().url(),
    });

    const result = schema.safeParse(props);

    if (result.error) {
      console.log(result.error);
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(
      new Platform({
        ...props,
        updatedAt: null,
        _id: uuidv7(),
      }),
    );
  }

  public static reconstitute(props: PlatformProps) {
    return new Platform(props);
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

  get url() {
    return this.props.url;
  }
}
