import * as z from 'zod';
import { v7 as uuid7 } from 'uuid';
import { Result } from '../../../result';
import { zodDomainValidationError } from '../../../zodErrors';
import { DomainValidationError } from '../../blog/article/domain/status';
import { Price } from './price';
import { Quantity } from './quantity';
import { Product } from '../../product/domain/product';
import { Discount } from '../../discount/domain/discount';
import { Coupon } from '../../coupon/domain/coupon';

interface OrderLineItemProps {
  _id: string;
  price: Price;
  originalPrice: Price;
  linePrice: Price;
  originalLinePrice: Price;
  quantity: Quantity;
  keys: string[];
  product: string;
  discount: string | null;
  coupon: string | null;
}

export interface CreateOrderLineItemProps extends Omit<OrderLineItemProps, '_id'> {}

export class OrderLineItem {
  constructor(private props: OrderLineItemProps) {}

  static create(props: CreateOrderLineItemProps): Result<OrderLineItem, DomainValidationError> {
    const schema = z.object({
      product: z.uuidv7(),
      coupon: z.uuidv7().nullable(),
      discount: z.uuidv7().nullable(),
      keys: z.array(z.uuidv7()),
    });

    const validation = schema.safeParse(props);
    if (validation.error) {
      return Result.fail(zodDomainValidationError(validation.error));
    }

    return Result.ok(
      new OrderLineItem({
        ...props,
        _id: uuid7(),
      }),
    );
  }

  static reconstitute(props: OrderLineItemProps): OrderLineItem {
    return new OrderLineItem(props);
  }

  get _id() {
    return this.props._id;
  }

  get finalLinePrice() {
    return this.props.linePrice;
  }

  get finalPrice() {
    return this.props.price;
  }

  get originalPrice() {
    return this.props.originalPrice;
  }

  get originalLinePrice() {
    return this.props.originalLinePrice;
  }

  get quantity() {
    return this.props.quantity;
  }

  get product() {
    return this.props.product;
  }

  get coupon() {
    return this.props.coupon;
  }

  get discount() {
    return this.props.discount;
  }

  get keys() {
    return this.props.keys;
  }
}
