import * as z from 'zod';
import { DomainValidationError } from '../../blog/article/domain/status';
import { zodDomainValidationError } from '../../../zodErrors';
import { v7 as uuid7 } from 'uuid';
import { Result } from '../../../result';
import { Meta } from '../../../meta';
import { CollectionTitle } from './collectionTitle';
import { Asset } from '../../../asset';
import { CollectionDescription } from './collectionDescription';
import { textUtils } from '../../../utils/textUtils';

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
  _id: string;
  products: string[];
}

export interface CollectionCreateProps
  extends Omit<CollectionProps, 'slug' | '_id' | 'createdAt' | 'updatedAt'> {
  slug?: string;
  endDate: Date | null;
}

export interface UpdateCollectionProps
  extends Omit<CollectionProps, '_id' | 'createdAt' | 'updatedAt' | 'cover'> {
  cover?: Asset;
}

export class Collection {
  constructor(private props: CollectionProps) {}

  public static create(props: CollectionCreateProps): Result<Collection, DomainValidationError> {
    const schema = z
      .object({
        slug: z.string().min(1).optional(),
        startDate: z.date(),
        endDate: z.date().nullable(),
        products: z.array(z.uuidv7()).min(1),
      })
      .superRefine(({ endDate, startDate }, ctx) => {
        if (endDate && startDate > endDate) {
          ctx.addIssue({
            code: 'custom',
            message: 'Start date must be before end date',
            path: ['startDate'],
          });
        }
      });

    const result = schema.safeParse(props);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(
      new Collection({
        ...props,
        createdAt: new Date(),
        updatedAt: null,
        slug: props.slug || textUtils.generateSlug(props.title.value),
        endDate: props.endDate,
        _id: uuid7(),
      }),
    );
  }

  public static reconstitute(props: CollectionProps) {
    return new Collection(props);
  }

  public update(props: UpdateCollectionProps): Result<undefined, DomainValidationError> {
    const schema = z
      .object({
        slug: z.string().min(1).optional(),
        startDate: z.date(),
        endDate: z.date().nullable(),
        products: z.array(z.uuidv7()).min(1),
      })
      .superRefine(({ endDate, startDate }, ctx) => {
        if (endDate && startDate > endDate) {
          ctx.addIssue({
            code: 'custom',
            message: 'Start date must be before end date',
            path: ['startDate'],
          });
        }
      });

    const result = schema.safeParse(props);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    this.props = {
      ...this.props,
      ...props,
      updatedAt: new Date(),
      slug: props.slug || textUtils.generateSlug(props.title.value),
      endDate: props.endDate || this.props.endDate,
    };

    return Result.ok();
  }

  public deactivate(): Result<undefined, DomainValidationError> {
    const now = new Date();
    if (this.props.endDate && this.props.endDate < now) {
      return Result.fail(new DomainValidationError('Collection already inactive'));
    }

    this.props.endDate = now;
    return Result.ok();
  }

  public removeProduct(productId: string): Result<undefined, DomainValidationError> {
    const index = this.props.products.findIndex((product) => product === productId);
    if (index === -1) {
      return Result.fail(new DomainValidationError('Product is not in this collection'));
    }

    this.props.products.splice(index, 1);
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

  get _id() {
    return this.props._id;
  }

  get products() {
    return this.props.products;
  }
}
