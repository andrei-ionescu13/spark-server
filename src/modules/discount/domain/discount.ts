import * as z from 'zod';
import { DomainValidationError } from '../../blog/article/domain/status';
import { zodDomainValidationError } from '../../../zodErrors';
import { DiscountTitle } from './discountTitle';
import { DiscountType } from './discountType';
import { DiscountValue } from './discountValue';
import { Result } from '../../../results';
import { v7 as uuid7 } from 'uuid';

interface DiscountProps {
  title: DiscountTitle;
  product: string;
  type: DiscountType;
  value: DiscountValue;
  startDate: Date;
  endDate: Date | null;
  _id: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface DiscountCreateProps
  extends Omit<DiscountProps, 'createdAt' | 'updatedAt' | '_id'> {}

export interface DiscountUpdateProps
  extends Omit<DiscountProps, 'createdAt' | 'updatedAt' | '_id'> {}

export class Discount {
  constructor(private props: DiscountProps) {}

  public static create(props: DiscountCreateProps): Result<Discount, DomainValidationError> {
    const schema = z
      .object({
        startDate: z.coerce.date(),
        endDate: z.date().nullable().optional(),
        product: z.uuidv7(),
      })
      .superRefine((data, ctx) => {
        if (data.endDate && data.startDate >= data.endDate) {
          ctx.addIssue({
            code: 'custom',
            message: 'Start date must be before end date',
            path: ['startDate'],
          });
        }
      });

    const result = schema.safeParse(props);

    if (result.error) {
      console.log(result.error);
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(
      new Discount({
        ...props,
        _id: uuid7(),
        createdAt: new Date(),
        updatedAt: null,
      }),
    );
  }

  public static reconstitute(props: DiscountProps) {
    return new Discount(props);
  }

  public update(props: DiscountUpdateProps): Result<undefined, DomainValidationError> {
    const schema = z
      .object({
        startDate: z.date(),
        endDate: z.date().nullable().optional(),
        product: z.uuidv7(),
      })
      .superRefine((data, ctx) => {
        if (data.endDate && data.startDate >= data.endDate) {
          ctx.addIssue({
            code: 'custom',
            message: 'Start date must be before end date',
            path: ['startDate'],
          });
        }
      });

    const result = schema.safeParse(props);

    if (result.error) {
      console.log(result.error);
      return Result.fail(zodDomainValidationError(result.error));
    }

    this.props.endDate = props.endDate;
    this.props.product = props.product;
    this.props.startDate = props.startDate;
    this.props.title = props.title;
    this.props.type = props.type;
    this.props.value = props.value;
    this.props.updatedAt = new Date();

    return Result.ok();
  }

  public deactivate(): Result<undefined, DomainValidationError> {
    const now = new Date();
    if (this.props.endDate && this.props.endDate < now) {
      return Result.fail(new DomainValidationError('Discount already inactive'));
    }

    this.props.endDate = now;
    return Result.ok();
  }

  // public removeProduct(productId: string): Result<undefined, DomainValidationError> {
  //   const index = this.props.products.findIndex((product) => product === productId);
  //   if (index === -1) {
  //     return Result.fail(new DomainValidationError('Product is not in this discount'));
  //   }

  //   this.props.products.splice(index, 1);
  //   return Result.ok();
  // }

  get isExpired() {
    return this.props.endDate && this.props.endDate < new Date();
  }

  get isActive() {
    return (
      this.props.startDate <= new Date() && (!this.props.endDate || this.props.endDate > new Date())
    );
  }

  get isScheduled() {
    return this.props.startDate < new Date();
  }

  get title() {
    return this.props.title;
  }

  get product() {
    return this.props.product;
  }

  get type() {
    return this.props.type;
  }

  get value() {
    return this.props.value;
  }

  get startDate() {
    return this.props.startDate;
  }

  get endDate() {
    return this.props.endDate;
  }

  get _id() {
    return this.props._id;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
