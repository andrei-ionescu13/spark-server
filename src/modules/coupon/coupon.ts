import * as z from 'zod';
import { DomainValidationError } from '../blog/article/status';
import { zodDomainValidationError } from '../../zodErrors';
import { CouponCode } from './couponCode';
import { CouponType } from './couponType';
import { CouponUserSelection } from './couponUserSelection';
import { CouponValue } from './couponValue';
import { CouponProductSelection } from './couponProductSelection';
import { Result } from '../../result';
import { v7 as uuid7 } from 'uuid';

interface CouponProps {
  createdAt: Date;
  _id: string;
  code: CouponCode;
  userSelection: CouponUserSelection;
  products: string[];
  users: string[];
  type: CouponType;
  productSelection: CouponProductSelection;
  value: CouponValue;
  startDate: Date;
  endDate: Date | null;
  updatedAt: Date | null;
}

interface CreateCouponProps extends Omit<CouponProps, '_id' | 'createdAt' | 'updatedAt'> {}

export class Coupon {
  constructor(private props: CouponProps) {}

  public static create(props: CreateCouponProps): Result<Coupon, DomainValidationError> {
    const schema = z
      .object({
        products: z.array(z.string()),
        users: z.array(z.string()),
        startDate: z.date(),
        endDate: z.date().nullable(),
      })
      .refine(({ startDate, endDate }) => endDate && startDate < endDate, {
        message: 'End date must be after start date',
        path: ['endDate'],
      })
      .refine(({ startDate, endDate }) => endDate && startDate > endDate, {
        message: 'Start date must be before end date',
        path: ['startDate'],
      });

    const result = schema.safeParse(props);

    if (result.error) {
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
    props: Omit<CouponProps, '_id' | 'userSelection' | 'productSelection'>,
  ): Result<{ removedUsers: string[]; newUsers: string[] }, DomainValidationError> {
    const schema = z.object({
      _id: z.string(),
      products: z.array(z.string()),
      users: z.array(z.string()),
      startDate: z.date(),
      endDate: z.date().optional(),
    });

    const result = schema.safeParse(props);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    let removedUsers: string[] = [];
    let newUsers: string[] = [];

    if (this.userSelection.value === 'selected') {
      const prevUsers = this.users.map((user) => user.toString());
      removedUsers = prevUsers.filter((user) => !props.users.includes(user));
      newUsers = props.users.filter((user) => !prevUsers.includes(user));
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
}
