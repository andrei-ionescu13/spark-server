import { error } from 'console';
import { Asset } from '../blog/article/asset';
import { DomainValidationError } from '../blog/article/status';
import { Entity } from '../entity';
import { Meta } from '../meta';
import { Result } from '../Result';
import { zodDomainValidationError } from '../zodErrors';
import { DealDescription } from './dealDescription';
import { DealTitle } from './dealTitle';
import * as z from 'zod';

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

export class Deal {
  constructor(private props: DealProps) {}

  static create(props: DealProps): Result<Deal, DomainValidationError> {
    const schema = z
      .object({
        _id: z.string(),
        slug: z.string(),
        startDate: z.date(),
        endDate: z.date().nullable(),
        createdAt: z.date(),
        updatedAt: z.date().nullable(),
        products: z.array(z.string()),
      })
      .refine(({ startDate, endDate }) => !endDate || startDate < endDate, {
        message: 'End date must be after start date',
        path: ['endDate'],
      })
      .refine(({ startDate, endDate }) => endDate && startDate > endDate, {
        message: 'Start date must be before end date',
        path: ['startDate'],
      });

    const validation = schema.safeParse(props);

    if (validation.error) return Result.fail(zodDomainValidationError(validation.error));

    return Result.ok(new Deal(props));
  }

  update(
    props: Omit<DealProps, 'id' | 'createdAt' | 'updatedAt'>,
  ): Result<void, DomainValidationError> {
    const schema = z
      .object({
        slug: z.string(),
        startDate: z.date(),
        endDate: z.date().nullable(),
        products: z.array(z.string()),
      })
      .refine(({ startDate, endDate }) => !endDate || startDate < endDate, {
        message: 'End date must be after start date',
        path: ['endDate'],
      })
      .refine(({ startDate, endDate }) => endDate && startDate > endDate, {
        message: 'Start date must be before end date',
        path: ['startDate'],
      });

    const validation = schema.safeParse(props);

    if (validation.error) return Result.fail(zodDomainValidationError(validation.error));

    this.props.slug = props.slug;
    this.props.startDate = props.startDate;
    this.props.endDate = props.endDate;
    this.props.products = props.products;
    this.props.cover = props.cover;
    this.props.title = props.title;
    this.props.description = props.description;

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
