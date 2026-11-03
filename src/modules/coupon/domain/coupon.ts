import * as z from 'zod';
import { DomainValidationError } from '../../blog/article/domain/status';
import { zodDomainValidationError } from '../../../zodErrors';
import { CouponCode } from './couponCode';
import { CouponType } from './couponType';
import { CouponUserSelection } from './couponUserSelection';
import { CouponValue } from './couponValue';
import { CouponProductSelection } from './couponProductSelection';
import { Result } from '../../../result';
import { v7 as uuid7 } from 'uuid';

interface CouponProps {
  createdAt: Date;
  _id: string;
  code: CouponCode;
  userSelection: CouponUserSelection;
  products: string[] | null;
  users: string[] | null;
  type: CouponType;
  productSelection: CouponProductSelection;
  value: CouponValue;
  startDate: Date;
  endDate: Date | null;
  updatedAt: Date | null;
}

export interface CreateCouponProps extends Omit<CouponProps, '_id' | 'createdAt' | 'updatedAt'> {}
export interface UpdateCouponProps extends Omit<CouponProps, '_id' | 'createdAt' | 'updatedAt'> {}

export class Coupon {
  constructor(private props: CouponProps) {}

  public static create(props: CreateCouponProps): Result<Coupon, DomainValidationError> {
    let schema = z
      .object({
        startDate: z.date(),
        endDate: z.coerce
          .date()
          .refine((date) => date > new Date(), { message: 'End date must be in the future' })
          .nullable(),
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

    if (props.productSelection.value === 'selected') {
      schema = schema.safeExtend({
        products: z.array(z.string()).min(1),
      });
    } else {
      schema = schema.safeExtend({
        products: z.null(),
      });
    }

    if (props.userSelection.value === 'selected') {
      schema = schema.safeExtend({
        users: z.array(z.string()).min(1),
      });
    } else {
      schema = schema.safeExtend({
        users: z.null(),
      });
    }
    const result = schema.safeParse(props);

    if (result.error) {
      console.log(result.error);
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(
      new Coupon({
        ...props,
        _id: uuid7(),
        createdAt: new Date(),
        updatedAt: null,
      }),
    );
  }

  public static reconstitute(props: CouponProps) {
    return new Coupon(props);
  }

  deactivate() {
    this.props.endDate = new Date();
  }

  update(
    props: UpdateCouponProps,
  ): Result<{ removedUsers: string[]; newUsers: string[] }, DomainValidationError> {
    let schema = z
      .object({
        startDate: z.date(),
        endDate: z.coerce
          .date()
          .refine((date) => date > new Date(), { message: 'End date must be in the future' })
          .nullable(),
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

    if (props.productSelection.value === 'selected') {
      schema = schema.safeExtend({
        products: z.array(z.string()).min(1),
      });
    } else {
      schema = schema.safeExtend({
        products: z.null(),
      });
    }

    if (props.userSelection.value === 'selected') {
      schema = schema.safeExtend({
        users: z.array(z.string()).min(1),
      });
    } else {
      schema = schema.safeExtend({
        users: z.null(),
      });
    }

    const result = schema.safeParse(props);

    if (result.error) {
      console.log(props);
      console.log(result.error);
      return Result.fail(zodDomainValidationError(result.error));
    }

    let removedUsers: string[] = [];
    let newUsers: string[] = [];

    if (this.userSelection.value === 'selected' || props.userSelection.value === 'selected') {
      const prevUsers = this.users || [];
      const allUsers = props.users || [];

      removedUsers = prevUsers.filter((user) => !allUsers.includes(user));
      newUsers = allUsers.filter((user) => !prevUsers.includes(user));
    }

    this.props = {
      ...this.props,
      ...props,
      updatedAt: new Date(),
    };

    return Result.ok({ removedUsers, newUsers });
  }

  get _id() {
    return this.props._id;
  }

  get code() {
    return this.props.code;
  }

  get userSelection() {
    return this.props.userSelection;
  }

  get products() {
    return this.props.products;
  }

  get users() {
    return this.props.users;
  }

  get type() {
    return this.props.type;
  }

  get productSelection() {
    return this.props.productSelection;
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

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
