import * as z from 'zod';
import { DomainValidationError } from '../../blog/article/domain/status';
import { zodDomainValidationError } from '../../../zodErrors';
import { v7 as uuid7 } from 'uuid';
import { Result } from '../../../results';
import { UserEmail } from './userEmail';
import { UserStatus } from './userStatus';

interface UserProps {
  email: UserEmail;
  password: string;
  createdAt: Date;
  status: UserStatus;
  updatedAt: Date | null;
  orders: string[];
  activeOrders: string[];
  ordersCount: number;
  totalSpend: number;
  reviews: string[];
  coupons: string[];
  _id: string;
}

interface CreateUserProps extends Omit<UserProps, 'createdAt' | 'updatedAt' | '_id'> {}

export class User {
  constructor(private readonly props: UserProps) {}

  public static create(props: CreateUserProps): Result<User, DomainValidationError> {
    const schema = z.object({
      password: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      orders: z.array(z.string()),
      activeOrders: z.array(z.string()),
      ordersCount: z.number(),
      totalSpend: z.number(),
      reviews: z.array(z.string()),
      coupons: z.array(z.string()),
      _id: z.string(),
    });

    const result = schema.safeParse(props);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(
      new User({
        ...props,
        createdAt: new Date(),
        updatedAt: null,
        _id: uuid7(),
      }),
    );
  }

  public static reconstitute(props: UserProps) {
    return new User(props);
  }

  removeCoupon = (couponId: string) => {
    this.props.coupons = this.props.coupons.filter((id) => id !== couponId);
  };

  addCoupon = (couponId: string) => {
    this.props.coupons = [...this.props.coupons, couponId];
  };

  removeReview = (reviewId: string): Result<undefined, DomainValidationError> => {
    const index = this.props.reviews.indexOf(reviewId);

    if (index === -1) {
      return Result.fail(new DomainValidationError('Review not found'));
    }

    this.props.reviews.slice(index, 1);
    return Result.ok();
  };

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get status() {
    return this.props.status;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get orders() {
    return this.props.orders;
  }

  get activeOrders() {
    return this.props.activeOrders;
  }

  get ordersCount() {
    return this.props.ordersCount;
  }

  get totalSpend() {
    return this.props.totalSpend;
  }

  get reviews() {
    return this.props.reviews;
  }

  get coupons() {
    return this.props.coupons;
  }

  get _id() {
    return this.props._id;
  }
}
