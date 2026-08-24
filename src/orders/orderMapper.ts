import { MappingValidationError } from '../blog/article/status';
import { Result } from '../Result';
import { LineItemDto, LineItemMapper } from './lineItemMapper';
import { OrderDoc } from './model';
import { Order } from './order';
import { OrderFulfillmentStatus } from './orderFulfillmentStatus';
import { OrderPaymentStatus } from './orderPaymentStatus';
import { OrderStatus } from './orderStatus';

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
  static toDomain(doc: OrderDoc): Result<Order, MappingValidationError> {
    const statusOrError = OrderStatus.create(doc.status);
    const paymentStatusOrError = OrderPaymentStatus.create(doc.paymentStatus);
    const fulfillmentStatusOrError = OrderFulfillmentStatus.create(doc.fulfillmentStatus);
    const lineItemsOrError = LineItemMapper.toDomainList(doc.lineItems);
    const combinedResult = Result.combine([
      statusOrError,
      paymentStatusOrError,
      fulfillmentStatusOrError,
      lineItemsOrError,
    ]);

    if (combinedResult.isErr())
      return Result.fail(new MappingValidationError(combinedResult.error.message));

    const status = statusOrError.value;
    const paymentStatus = paymentStatusOrError.value;
    const fulfillmentStatus = fulfillmentStatusOrError.value;
    const lineItems = lineItemsOrError.value;

    return Result.ok(
      new Order({
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
        lineItems: lineItems,
      }),
    );
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
