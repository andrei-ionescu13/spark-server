import { DomainValidationError } from '../blog/article/status';
import { ProductDto, ProductMapper } from '../product/productMapper';
import { Result } from '../../Result';
import { Discount } from './discount';
import { DiscountTitle } from './discountTitle';
import { DiscountType } from './discountType';
import { DiscountValue } from './discountValue';
import { DiscountDoc } from './model';

export interface DiscountDto {
  title: string;
  products: ProductDto[];
  type: string;
  value: number;
  startDate: Date;
  endDate: Date | null;
  _id: string;
}

export interface DiscountPersistance {
  title: string;
  products: string[];
  type: 'amount' | 'percentage';
  value: number;
  startDate: Date;
  endDate: Date | null;
  _id: string;
}

export class DiscountMapper {
  public static toDomain(entity: DiscountDoc): Result<Discount, DomainValidationError> {
    const titleOrError = DiscountTitle.create(entity.title);
    const typeOrError = DiscountType.create(entity.type);
    const valueOrError = DiscountValue.create(entity.value);

    const result = Result.combine([titleOrError, typeOrError, valueOrError]);

    if (result.isErr()) {
      return Result.fail(new DomainValidationError(result.error.message));
    }

    const title = titleOrError.value;
    const type = typeOrError.value;
    const value = valueOrError.value;

    const discountOrError = Discount.create({
      ...entity,
      title,
      type,
      value,
    });

    if (discountOrError.isErr()) {
      return Result.fail(new DomainValidationError(discountOrError.error.message));
    }

    const developer = discountOrError.value;
    return Result.ok(developer);
  }

  static toDto(entity: any): DiscountDto {
    return {
      title: entity.title,
      products: ProductMapper.toDtoList(entity.products),
      type: entity.type,
      value: entity.value,
      startDate: entity.startDate,
      endDate: entity.endDate,
      _id: entity._id,
    };
  }

  static toDtoList(entities: any[]): DiscountDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toPersistance(entity: Discount): DiscountPersistance {
    return {
      title: entity.title.value,
      products: entity.products,
      type: entity.type.value,
      value: entity.value.value,
      startDate: entity.startDate,
      endDate: entity.endDate,
      _id: entity._id,
    };
  }
}
