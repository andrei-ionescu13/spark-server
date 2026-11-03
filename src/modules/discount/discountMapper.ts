import { DomainValidationError } from '../blog/article/domain/status';
import { ProductDto, ProductMapper } from '../product/productMapper';
import { Discount } from './domain/discount';
import { DiscountTitle } from './domain/discountTitle';
import { DiscountType } from './domain/discountType';
import { DiscountValue } from './domain/discountValue';
import { DiscountDoc, DiscountPopulatedDoc } from './model';

export interface DiscountDto {
  title: string;
  product: string;
  type: string;
  value: number;
  startDate: Date;
  endDate: Date | null;
  _id: string;
}

export interface DiscountPopulatedDto extends Omit<DiscountDto, 'product'> {
  product: ProductDto;
}

export class DiscountMapper {
  public static toDomain(entity: DiscountDoc): Discount {
    const title = DiscountTitle.reconstitute(entity.title);
    const type = DiscountType.reconstitute(entity.type);
    const value = DiscountValue.reconstitute(entity.value);
    const discount = Discount.reconstitute({
      ...entity,
      title,
      type,
      value,
    });

    return discount;
  }

  static toDto(entity: DiscountDoc): DiscountDto {
    return {
      title: entity.title,
      product: entity.product,
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

  static toPopulatedDto(entity: DiscountPopulatedDoc): DiscountPopulatedDto {
    return {
      title: entity.title,
      product: ProductMapper.toDto(entity.product),
      type: entity.type,
      value: entity.value,
      startDate: entity.startDate,
      endDate: entity.endDate,
      _id: entity._id,
    };
  }

  static toPopulatedDtoList(entities: DiscountPopulatedDoc[]): DiscountPopulatedDto[] {
    return entities.map((entity) => this.toPopulatedDto(entity));
  }

  static toPersistance(entity: Discount): DiscountDoc {
    return {
      title: entity.title.value,
      product: entity.product,
      type: entity.type.value,
      value: entity.value.value,
      startDate: entity.startDate,
      endDate: entity.endDate,
      _id: entity._id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
