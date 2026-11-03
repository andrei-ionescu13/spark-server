import { DomainValidationError } from '../blog/article/domain/status';
import { UserDoc } from './model';
import { User } from './domain/user';
import { UserEmail } from './domain/userEmail';
import { UserStatus } from './domain/userStatus';

export interface UserPersistance {
  email: string;
  password: string;
  createdAt: Date;
  status: 'active' | 'inactive' | 'banned';
  updatedAt: Date | null;
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
  updatedAt: Date | null;
  orders: string[];
  activeOrders: string[];
  ordersCount: number;
  totalSpend: number;
  reviews: string[];
  coupons: string[];
  _id: string;
}

export class UserMapper {
  public static toDomain(entity: UserDoc): User {
    const email = UserEmail.reconstitute(entity.email);
    const status = UserStatus.reconstitute(entity.status);
    const user = User.reconstitute({
      ...entity,
      email,
      status,
    });

    return user;
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

  static toPersistance(entity: User): UserDoc {
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
