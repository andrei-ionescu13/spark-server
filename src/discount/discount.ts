import * as z from 'zod';
import { DomainValidationError } from '../blog/article/status';
import { Result } from '../Result';
import { zodDomainValidationError } from '../zodErrors';
import { DiscountTitle } from './discountTitle';
import { DiscountType } from './discountType';
import { DiscountValue } from './discountValue';

interface DiscountProps {
  title: DiscountTitle;
  products: string[];
  type: DiscountType;
  value: DiscountValue;
  startDate: Date;
  endDate: Date | null;
  _id: string;
}

interface DiscountCreateProps extends Omit<DiscountProps, 'endDate'> {
  endDate?: Date | null;
}

export class Discount {
  constructor(private props: DiscountProps) {}

  public static create(props: DiscountCreateProps): Result<Discount, DomainValidationError> {
    const schema = z
      .object({
        _id: z.uuidv7(),
        startDate: z.date(),
        endDate: z.date().optional(),
        products: z.array(z.uuidv7()).min(1),
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
      new Discount({
        ...props,
        endDate: props.endDate || null,
      }),
    );
  }

  public update(props: Omit<DiscountCreateProps, '_id'>): Result<undefined, DomainValidationError> {
    const schema = z
      .object({
        isDeal: z.boolean(),
        startDate: z.date(),
        endDate: z.date().optional(),
        products: z.array(z.uuidv7()).min(1),
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

    this.props = {
      ...this.props,
      ...props,
      endDate: props.endDate || this.props.endDate,
    };

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

  public removeProduct(productId: string): Result<undefined, DomainValidationError> {
    const index = this.props.products.findIndex((product) => product === productId);
    if (index === -1) {
      return Result.fail(new DomainValidationError('Product is not in this discount'));
    }

    this.props.products.splice(index, 1);
    return Result.ok();
  }

  public isExpired() {
    return this.props.endDate && this.props.endDate < new Date();
  }

  public isActive() {
    return (
      this.props.startDate <= new Date() && (!this.props.endDate || this.props.endDate > new Date())
    );
  }

  public isScheduled() {
    return this.props.startDate < new Date();
  }

  get title() {
    return this.props.title;
  }

  get products() {
    return this.props.products;
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
}
