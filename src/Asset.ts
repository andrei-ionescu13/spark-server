import * as z from 'zod';
import { zodDomainValidationError } from './zodErrors';
import { DomainValidationError } from './modules/blog/article/domain/status';
import { Result } from './result';
import { v7 as uuid7 } from 'uuid';

export interface AssetDoc {
  _id: string;
  public_id: string;
  width: number;
  height: number;
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
  created_at: string;
  url: string;
  secure_url: string;
  original_filename: string;
  format: string;

  // version: number;
  // signature: string;
  // tags: Array<string>;
  // pages: number;
  // bytes: number;
  // type: string;
  // etag: string;
  // placeholder: boolean;
  // access_mode: string;
  // moderation: Array<string>;
  // access_control: Array<string>;
  // context: object;
  // metadata: object;
  // colors?: [string, number][];
}

interface AssetProps {
  _id: string;
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

interface CreateAssetProps extends Omit<AssetProps, '_id'> {}

export class Asset {
  constructor(private props: AssetProps) {}

  public static create(props: CreateAssetProps): Result<Asset, DomainValidationError> {
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
      console.log(result.error);
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(
      new Asset({
        ...props,
        _id: uuid7(),
      }),
    );
  }

  public static reconstitute(props: AssetProps) {
    return new Asset(props);
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

  get _id() {
    return this.props._id;
  }
}
