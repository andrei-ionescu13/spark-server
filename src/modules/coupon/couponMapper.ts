import { DomainValidationError } from '../blog/article/status';
import { ProductDto } from '../product/productMapper';
import { Result } from '../../Result';
import { UserDto } from '../users/userMapper';
import { Coupon } from './coupon';
import { CouponCode } from './couponCode';
import { CouponProductSelection } from './couponProductSelection';
import { CouponType } from './couponType';
import { CouponUserSelection } from './couponUserSelection';
import { CouponValue } from './couponValue';
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
  static toDomain(entity: CouponDoc): Result<Coupon, DomainValidationError> {
    const codeOrError = CouponCode.create(entity.code);
    const userSelectionOrError = CouponUserSelection.create(entity.userSelection);
    const typeOrError = CouponType.create(entity.type);
    const productSelectionOrError = CouponProductSelection.create(entity.productSelection);
    const valueOrError = CouponValue.create(entity.value);

    const result = Result.combine([
      codeOrError,
      userSelectionOrError,
      typeOrError,
      productSelectionOrError,
      valueOrError,
    ]);

    if (result.isErr()) {
      return Result.fail(new DomainValidationError(result.error.message));
    }

    const code = codeOrError.value;
    const userSelection = userSelectionOrError.value;
    const type = typeOrError.value;
    const productSelection = productSelectionOrError.value;
    const value = valueOrError.value;

    const couponOrError = Coupon.create({
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
    });

    if (couponOrError.isErr()) {
      return Result.fail(new DomainValidationError(couponOrError.error.message));
    }
    const coupon = couponOrError.value;

    return Result.ok(coupon);
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
    };
  }
}
