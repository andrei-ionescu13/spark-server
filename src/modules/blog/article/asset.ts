import * as z from 'zod';
import { Result } from '../../../Result';
import { zodDomainValidationError } from '../../../zodErrors';
import { DomainValidationError } from './status';

interface AssetProps {
  publicId: string;
  width: number;
  height: number;
  format: string;
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  createdAt: string;
  url: string;
  secureUrl: string;
  originalFilename: string;
}

export class Asset {
  constructor(private props: AssetProps) {}

  public static create(props: AssetProps): Result<Asset, DomainValidationError> {
    const schema = z.object({
      publicId: z.string(),
      width: z.number(),
      height: z.number(),
      format: z.string(),
      resourceType: z.enum(['image', 'video', 'raw', 'auto']).optional(),
      createdAt: z.string(),
      url: z.string(),
      secureUrl: z.string(),
      originalFilename: z.string(),
    });

    const result = schema.safeParse(props);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new Asset(props));
  }

  get publicId() {
    return this.props.publicId;
  }

  get width() {
    return this.props.width;
  }

  get height() {
    return this.props.height;
  }

  get format() {
    return this.props.format;
  }

  get resourceType() {
    return this.props.resourceType;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get url() {
    return this.props.url;
  }

  get secureUrl() {
    return this.props.secureUrl;
  }

  get originalFilename() {
    return this.props.originalFilename;
  }
}
