import { CouponDto, CouponMapper } from '../coupon/couponMapper';
import { DiscountDto, DiscountMapper } from '../discount/discountMapper';
import { Discount } from '../discount/domain/discount';
import { KeyDto, KeyMapper } from '../key/keyMapper';
import { ProductDto, ProductMapper } from '../product/productMapper';
import { OrderLineItem } from './domain/orderLineItem';
import { Price } from './domain/price';
import { OrderLineItemDoc } from './model';

export interface OrderLineItemDto {
  _id: string;
  product: ProductDto;
  finalLinePrice: number;
  finalPrice: number;
  originalPrice: number;
  originalLinePrice: number;
  quantity: number;
  keys: KeyDto[];
  discount: DiscountDto | null;
  coupon: CouponDto | null;
}

export class OrderLineItemMapper {
  static toDomain(doc: OrderLineItemDoc): OrderLineItem {
    const finalPrice = Price.reconstitute(doc.finalPrice);
    const finalLinePrice = Price.reconstitute(doc.finalLinePrice);
    const originalPrice = Price.reconstitute(doc.originalPrice);
    const originalLinePrice = Price.reconstitute(doc.originalLinePrice);
    const quantity = Price.reconstitute(doc.quantity);

    const lineItem = OrderLineItem.reconstitute({
      _id: doc._id,
      product: doc.product,
      linePrice: finalLinePrice,
      price: finalPrice,
      originalPrice,
      originalLinePrice,
      quantity,
      coupon: doc.coupon,
      discount: doc.discount,
      keys: doc.keys,
    });

    return lineItem;
  }

  static toDomainList(docs: OrderLineItemDoc[]): OrderLineItem[] {
    return docs.map((doc) => OrderLineItemMapper.toDomain(doc));
  }

  static toDto(doc: OrderLineItemPopulatedDoc): OrderLineItemDto {
    return {
      _id: doc._id,
      product: ProductMapper.toDto(doc.product),
      finalLinePrice: doc.finalLinePrice,
      finalPrice: doc.finalPrice,
      originalPrice: doc.originalPrice,
      originalLinePrice: doc.originalLinePrice,
      quantity: doc.quantity,
      keys: KeyMapper.toDtoList(doc.keys),
      coupon: doc.coupon ? CouponMapper.toDto(doc.coupon) : null,
      discount: doc.discount ? DiscountMapper.toDto(doc.discount) : null,
    };
  }

  static toDtoList(docs: OrderLineItemPopulatedDoc[]): OrderLineItemDto[] {
    return docs.map((doc) => OrderLineItemMapper.toDto(doc));
  }

  static toPersistence(entity: OrderLineItem): OrderLineItemDoc {
    return {
      _id: entity._id,
      product: entity.product,
      finalLinePrice: entity.finalLinePrice.value,
      finalPrice: entity.finalPrice.value,
      originalPrice: entity.originalPrice.value,
      originalLinePrice: entity.originalLinePrice.value,
      quantity: entity.quantity.value,
      discount: entity.discount,
      coupon: entity.coupon,
      keys: entity.keys,
    };
  }

  static toPersistenceList(entities: OrderLineItem[]): OrderLineItemDoc[] {
    return entities.map((entity) => OrderLineItemMapper.toPersistence(entity));
  }
}
