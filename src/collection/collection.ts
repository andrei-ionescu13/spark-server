import * as z from 'zod';
import { textUtils } from '../../utils/textUtils';
import { Asset } from '../blog/article/asset';
import { DomainValidationError } from '../blog/article/status';
import { Meta } from '../Meta';
import { Result } from '../Result';
import { zodDomainValidationError } from '../zodErrors';
import { CollectionDescription } from './collectionDescription';
import { CollectionTitle } from './collectionTitle';

interface CollectionProps {
  cover: Asset;
  title: CollectionTitle;
  description: CollectionDescription;
  slug: string;
  startDate: Date;
  endDate: Date | null;
  meta: Meta;
  createdAt: Date;
  updatedAt: Date | null;
  isDeal: boolean;
  _id: string;
}

interface CollectionCreateProps
  extends Omit<CollectionProps, 'createdAt' | 'updatedAt' | 'slug' | 'endDate'> {
  createdAt?: Date;
  updatedAt?: Date | null;
  slug?: string;
  endDate?: Date | null;
}

export class Collection {
  constructor(private props: CollectionProps) {}

  public static create(props: CollectionCreateProps): Result<Collection, DomainValidationError> {
    const schema = z
      .object({
        createdAt: z.date().optional(),
        updatedAt: z.date().optional(),
        slug: z.string().min(1).optional(),
        isDeal: z.boolean(),
        _id: z.uuidv7(),
        startDate: z.date(),
        endDate: z.date().optional(),
      })
      .refine((data) => data.endDate && data.startDate < data.endDate, {
        message: 'Start date must be before end date',
        path: ['startDate'],
      })
      .refine((data) => data.endDate && data.endDate > data.startDate, {
        message: 'End date must be after start date',
        path: ['endDate'],
      });

    const result = schema.safeParse(props);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(
      new Collection({
        ...props,
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || null,
        slug: props.slug || textUtils.generateSlug(props.title.value),
        endDate: props.endDate || null,
      }),
    );
  }

  public deactivate(): Result<undefined, DomainValidationError> {
    const now = new Date();
    if (this.props.endDate && this.props.endDate < now) {
      return Result.fail(new DomainValidationError('Collection already inactive'));
    }

    this.props.endDate = now;
    return Result.ok();
  }

  get cover() {
    return this.props.cover;
  }

  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
  }

  get slug() {
    return this.props.slug;
  }

  get startDate() {
    return this.props.startDate;
  }

  get endDate() {
    return this.props.endDate;
  }

  get meta() {
    return this.props.meta;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get isDeal() {
    return this.props.isDeal;
  }

  get _id() {
    return this.props._id;
  }
}
