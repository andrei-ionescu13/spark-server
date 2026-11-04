import * as z from 'zod';
import { DomainValidationError } from '../../blog/article/domain/status';
import { Result } from '../../../results';
import { zodDomainValidationError } from '../../../zodErrors';
import { OrderFulfillmentStatus } from './orderFulfillmentStatus';
import { OrderPaymentStatus } from './orderPaymentStatus';
import { OrderStatus } from './orderStatus';
import { v7 as uuid7 } from 'uuid';
import { OrderLineItem } from './orderLineItem';
import { Price } from './price';

export interface OrderProps {
  _id: string;
  status: OrderStatus;
  orderNumber: string;
  paymentStatus: OrderPaymentStatus;
  fulfillmentStatus: OrderFulfillmentStatus;
  customer: string;
  createdAt: Date;
  itemCount: number;
  totalPrice: Price;
  totalDiscount: Price;
  lineItems: OrderLineItem[];
  updatedAt: Date | null;
  currency: string;
  stripeId: string;
}

export interface CreateOrderProps extends Omit<OrderProps, 'createdAt' | 'updatedAt' | '_id'> {}

export class Order {
  constructor(private props: OrderProps) {}

  static create(props: CreateOrderProps): Result<Order, DomainValidationError> {
    const schema = z.object({
      _id: z.string(),
      orderNumber: z.string(),
      email: z.email(),
      customer: z.string(),
      itemCount: z.number(),
      totalPrice: z.number(),
      totalDiscount: z.number(),
      currency: z.string(),
      stripeId: z.string(),
    });

    const validation = schema.safeParse(props);
    if (validation.error) {
      return Result.fail(zodDomainValidationError(validation.error));
    }

    return Result.ok(
      new Order({
        ...props,
        createdAt: new Date(),
        _id: uuid7(),
        updatedAt: null,
      }),
    );
  }

  public static reconstitute(props: OrderProps) {
    return new Order(props);
  }

  public complete(): Result<undefined, DomainValidationError> {
    if (this.isArchived) {
      return Result.fail(new DomainValidationError('cannot update an archived order'));
    }

    if (this.isCanceled) {
      return Result.fail(new DomainValidationError('cannot update a canceled order'));
    }

    this.props.paymentStatus = new OrderPaymentStatus({ value: 'paid' });
    this.props.fulfillmentStatus = new OrderFulfillmentStatus({ value: 'fulfilled' });
    this.props.status = new OrderStatus({ value: 'archived' });

    return Result.ok();
  }

  public cancel(): Result<undefined, DomainValidationError> {
    if (this.isArchived) {
      return Result.fail(new DomainValidationError('cannot update an archived order'));
    }

    if (this.isCanceled) {
      return Result.fail(new DomainValidationError('cannot update a canceled order'));
    }

    this.props.paymentStatus = new OrderPaymentStatus({ value: 'expired' });
    this.props.fulfillmentStatus = new OrderFulfillmentStatus({ value: 'unfulfilled' });
    this.props.status = new OrderStatus({ value: 'canceled' });

    return Result.ok();
  }

  get _id() {
    return this.props._id;
  }

  get status() {
    return this.props.status;
  }

  get orderNumber() {
    return this.props.orderNumber;
  }

  get paymentStatus() {
    return this.props.paymentStatus;
  }

  get fulfillmentStatus() {
    return this.props.fulfillmentStatus;
  }

  get customer() {
    return this.props.customer;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get itemCount() {
    return this.props.itemCount;
  }

  get totalPrice() {
    return this.props.totalPrice;
  }

  get totalDiscount() {
    return this.props.totalDiscount;
  }

  get lineItems() {
    return this.props.lineItems;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get currency() {
    return this.props.currency;
  }

  get stripeId() {
    return this.props.stripeId;
  }

  get isCanceled() {
    return this.props.status.value === 'canceled';
  }

  get isArchived() {
    return this.props.status.value === 'archived';
  }
}
