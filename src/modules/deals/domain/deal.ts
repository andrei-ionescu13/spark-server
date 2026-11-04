import { DomainValidationError } from '../../blog/article/domain/status';
import { zodDomainValidationError } from '../../../zodErrors';
import { DealDescription } from './dealDescription';
import { DealTitle } from './dealTitle';
import * as z from 'zod';
import { Meta } from '../../../metas';
import { Result } from '../../../result';
import { v7 as uuid7 } from 'uuid';
import { Asset } from '../../../assets';

interface DealProps {
  _id: string;
  cover: Asset;
  title: DealTitle;
  description: DealDescription;
  slug: string;
  startDate: Date;
  endDate: Date | null;
  meta: Meta;
  createdAt: Date;
  updatedAt: Date | null;
  products: string[];
}

export interface CreateDealProps extends Omit<DealProps, 'createdAt' | 'updatedAt' | '_id'> {}

export interface UpdateDealProps
  extends Omit<DealProps, '_id' | 'createdAt' | 'updatedAt' | 'cover'> {
  cover?: Asset;
}

export class Deal {
  constructor(private props: DealProps) {}

  static create(props: CreateDealProps): Result<Deal, DomainValidationError> {
    const schema = z
      .object({
        slug: z.string(),
        startDate: z.date(),
        endDate: z.date().nullable(),
        products: z.array(z.string()),
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

    const validation = schema.safeParse(props);

    if (validation.error) {
      console.log(validation.error);
      return Result.fail(zodDomainValidationError(validation.error));
    }

    return Result.ok(
      new Deal({
        ...props,
        createdAt: new Date(),
        updatedAt: null,
        _id: uuid7(),
      }),
    );
  }

  public static reconstitute(props: DealProps) {
    return new Deal(props);
  }

  update(props: UpdateDealProps): Result<void, DomainValidationError> {
    const schema = z
      .object({
        slug: z.string(),
        startDate: z.date(),
        endDate: z.date().nullable().optional(),
        products: z.array(z.string()),
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

    const validation = schema.safeParse(props);

    if (validation.error) return Result.fail(zodDomainValidationError(validation.error));

    this.props.slug = props.slug;
    this.props.startDate = props.startDate;
    this.props.endDate = props.endDate;
    this.props.products = props.products;
    this.props.title = props.title;
    this.props.description = props.description;
    this.props.updatedAt = new Date();

    if (props.cover) {
      this.props.cover = props.cover;
    }

    return Result.ok();
  }

  deactivate() {
    this.props.endDate = new Date();
  }

  get _id() {
    return this.props._id;
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

  get products() {
    return this.props.products;
  }
}
