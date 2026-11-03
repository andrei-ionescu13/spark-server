import { ProductDto } from '../product/productMapper';
import { UserDto } from '../users/userMapper';
import { Coupon } from './domain/coupon';
import { CouponCode } from './domain/couponCode';
import { CouponProductSelection } from './domain/couponProductSelection';
import { CouponType } from './domain/couponType';
import { CouponUserSelection } from './domain/couponUserSelection';
import { CouponValue } from './domain/couponValue';
import { CouponDoc } from './model';

export interface CouponDto {
  _id: string;
  code: string;
  userSelection: 'general' | 'selected';
  type: 'amount' | 'percentage';
  productSelection: 'general' | 'selected';
  products: ProductDto[];
  users: UserDto[];
  value: number;
  startDate: Date;
  endDate: Date | null;
}

export class CouponMapper {
  static toDomain(entity: CouponDoc): Coupon {
    const code = CouponCode.reconstitute(entity.code);
    const userSelection = CouponUserSelection.reconstitute(entity.userSelection);
    const type = CouponType.reconstitute(entity.type);
    const productSelection = CouponProductSelection.reconstitute(entity.productSelection);
    const value = CouponValue.reconstitute(entity.value);

    const coupon = Coupon.reconstitute({
      _id: entity._id,
      code,
      userSelection,
      products: entity.products,
      users: entity.users,
      type,
      productSelection,
      value,
      startDate: entity.startDate,
      endDate: entity.endDate,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });

    return coupon;
  }

  static toDto(entity: any): CouponDto {
    return {
      _id: entity._id,
      code: entity.code,
      userSelection: entity.userSelection,
      type: entity.type,
      productSelection: entity.productSelection,
      products: entity.products,
      users: entity.users,
      value: entity.value,
      startDate: entity.startDate,
      endDate: entity.endDate,
    };
  }

  static toDtoList(entities: any[]): CouponDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toPersistance(entity: Coupon): CouponDoc {
    return {
      _id: entity._id,
      code: entity.code.value,
      userSelection: entity.userSelection.value,
      products: entity.products,
      users: entity.users,
      type: entity.type.value,
      productSelection: entity.productSelection.value,
      value: entity.value.value,
      startDate: entity.startDate,
      endDate: entity.endDate,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
