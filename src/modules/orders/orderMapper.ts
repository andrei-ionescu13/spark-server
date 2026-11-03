import { MappingValidationError } from '../blog/article/domain/status';
import { LineItemDto, LineItemMapper } from './lineItemMapper';
import { OrderDoc } from './model';
import { Order } from './domain/order';
import { OrderFulfillmentStatus } from './domain/orderFulfillmentStatus';
import { OrderPaymentStatus } from './domain/orderPaymentStatus';
import { OrderStatus } from './domain/orderStatus';

type Status = 'open' | 'archived' | 'canceled';
type PaymentStatus = 'authorized' | 'paid' | 'pending' | 'refunded' | 'expired';
type FulfillmentStatus = 'fulfilled' | 'unfulfilled' | 'partially fulfilled';

export interface OrderDto {
  _id: string;
  status: Status;
  orderNumber: string;
  email: string;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  customer: string;
  createdAt: Date;
  itemCount: number;
  totalPrice: number;
  totalDiscounts: number;
  lineItems: LineItemDto[];
}

export class OrderMapper {
  static toDomain(doc: OrderDoc): Order {
    const status = OrderStatus.reconstitute(doc.status);
    const paymentStatus = OrderPaymentStatus.reconstitute(doc.paymentStatus);
    const fulfillmentStatus = OrderFulfillmentStatus.reconstitute(doc.fulfillmentStatus);
    const lineItems = LineItemMapper.toDomainList(doc.lineItems);
    const order = Order.reconstitute({
      _id: doc._id,
      status: status,
      orderNumber: doc.orderNumber,
      email: doc.email,
      paymentStatus: paymentStatus,
      fulfillmentStatus: fulfillmentStatus,
      customer: doc.customer,
      createdAt: doc.createdAt,
      itemCount: doc.itemCount,
      totalPrice: doc.totalPrice,
      totalDiscounts: doc.totalDiscounts,
      updatedAt: doc.updatedAt,
      lineItems: lineItems,
    });

    return order;
  }

  static toDto(doc: OrderDoc): OrderDto {
    return {
      _id: doc._id,
      status: doc.status,
      orderNumber: doc.orderNumber,
      email: doc.email,
      paymentStatus: doc.paymentStatus,
      fulfillmentStatus: doc.fulfillmentStatus,
      customer: doc.customer,
      createdAt: doc.createdAt,
      itemCount: doc.itemCount,
      totalPrice: doc.totalPrice,
      totalDiscounts: doc.totalDiscounts,
      lineItems: LineItemMapper.toDtoList(doc.lineItems),
    };
  }

  static toDtoList(docs: OrderDoc[]): OrderDto[] {
    return docs.map((doc) => OrderMapper.toDto(doc));
  }
}
