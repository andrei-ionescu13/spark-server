import { MappingValidationError } from '../blog/article/domain/status';
import { OrderDoc } from './model';
import { Order } from './domain/order';
import { OrderFulfillmentStatus } from './domain/orderFulfillmentStatus';
import { OrderPaymentStatus } from './domain/orderPaymentStatus';
import { OrderStatus } from './domain/orderStatus';
import { OrderLineItemDto, OrderLineItemMapper } from './orderLineItemMapper';
import { Price } from './domain/price';

type Status = 'open' | 'archived' | 'canceled';
type PaymentStatus = 'authorized' | 'paid' | 'pending' | 'refunded' | 'expired';
type FulfillmentStatus = 'fulfilled' | 'unfulfilled' | 'partially fulfilled';

export interface OrderDto {
  _id: string;
  status: Status;
  orderNumber: string;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  user: string;
  createdAt: Date;
  itemCount: number;
  totalPrice: number;
  totalDiscount: number;
  lineItems: OrderLineItemDto[];
}

export class OrderMapper {
  static toDomain(doc: OrderDoc): Order {
    const status = OrderStatus.reconstitute(doc.status);
    const paymentStatus = OrderPaymentStatus.reconstitute(doc.paymentStatus);
    const fulfillmentStatus = OrderFulfillmentStatus.reconstitute(doc.fulfillmentStatus);
    const lineItems = OrderLineItemMapper.toDomainList(doc.lineItems);
    const totalPrice = Price.reconstitute(doc.totalPrice);
    const totalDiscount = Price.reconstitute(doc.totalDiscount);

    const order = Order.reconstitute({
      _id: doc._id,
      status: status,
      orderNumber: doc.orderNumber,
      paymentStatus: paymentStatus,
      fulfillmentStatus: fulfillmentStatus,
      user: doc.user,
      createdAt: doc.createdAt,
      itemCount: doc.itemCount,
      totalPrice,
      totalDiscount,
      updatedAt: doc.updatedAt,
      lineItems: lineItems,
      currency: doc.currency,
      stripeId: doc.stripeId,
    });

    return order;
  }

  static toDto(doc: any): OrderDto {
    return {
      _id: doc._id,
      status: doc.status,
      orderNumber: doc.orderNumber,
      paymentStatus: doc.paymentStatus,
      fulfillmentStatus: doc.fulfillmentStatus,
      user: doc.user,
      createdAt: doc.createdAt,
      itemCount: doc.itemCount,
      totalPrice: doc.totalPrice,
      totalDiscount: doc.totalDiscount,
      lineItems: OrderLineItemMapper.toDtoList(doc.lineItems),
    };
  }

  static toDtoList(docs: OrderDoc[]): OrderDto[] {
    return docs.map((doc) => OrderMapper.toDto(doc));
  }
}
