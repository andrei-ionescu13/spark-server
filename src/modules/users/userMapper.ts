import { DomainValidationError } from '../blog/article/status';
import { Result } from '../../Result';
import { UserDoc } from './model';
import { User } from './user';
import { UserEmail } from './userEmail';
import { UserStatus } from './userStatus';

export interface UserPersistance {
  email: string;
  password: string;
  createdAt: Date;
  status: 'active' | 'inactive' | 'banned';
  updatedAt: Date;
  orders: string[];
  activeOrders: string[];
  ordersCount: number;
  totalSpend: number;
  reviews: string[];
  coupons: string[];
  _id: string;
}

export interface UserDto {
  email: string;
  createdAt: Date;
  status: 'active' | 'inactive' | 'banned';
  updatedAt: Date;
  orders: string[];
  activeOrders: string[];
  ordersCount: number;
  totalSpend: number;
  reviews: string[];
  coupons: string[];
  _id: string;
}

export class UserMapper {
  public static toDomain(entity: UserDoc): Result<User, DomainValidationError> {
    const emailOrError = UserEmail.create(entity.email);
    const statusOrError = UserStatus.create(entity.status);

    const result = Result.combine([emailOrError, statusOrError]);
    if (result.isErr()) {
      return Result.fail(new DomainValidationError(result.error.message));
    }

    const email = emailOrError.value;
    const status = statusOrError.value;

    const userOrError = User.create({
      ...entity,
      email,
      status,
    });

    if (userOrError.isErr()) {
      return Result.fail(new DomainValidationError(userOrError.error.message));
    }

    const user = userOrError.value;
    return Result.ok(user);
  }

  public static toDto(entity: UserDoc): UserDto {
    return {
      email: entity.email,
      createdAt: entity.createdAt,
      status: entity.status,
      updatedAt: entity.updatedAt,
      orders: entity.orders,
      activeOrders: entity.activeOrders,
      ordersCount: entity.ordersCount,
      totalSpend: entity.totalSpend,
      reviews: entity.reviews,
      coupons: entity.coupons,
      _id: entity._id,
    };
  }

  public static toDtoList(entities: UserDoc[]): UserDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toPersistance(entity: User): UserPersistance {
    return {
      email: entity.email.value,
      password: entity.password,
      createdAt: entity.createdAt,
      status: entity.status.value,
      updatedAt: entity.updatedAt,
      orders: entity.orders,
      activeOrders: entity.activeOrders,
      ordersCount: entity.ordersCount,
      totalSpend: entity.totalSpend,
      reviews: entity.reviews,
      coupons: entity.coupons,
      _id: entity._id,
    };
  }
}
