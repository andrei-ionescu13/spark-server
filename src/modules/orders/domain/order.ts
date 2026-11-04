import * as z from 'zod';
import { DomainValidationError } from '../../blog/article/domain/status';
import { Result } from '../../../result';
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
  user: string;
  createdAt: Date;
  itemCount: number;
  totalPrice: Price;
  totalDiscount: Price;
  lineItems: OrderLineItem[];
  updatedAt: Date | null;
  currency: string;
  stripeId: string;
}

export interface CreateOrderProps
  extends Omit<OrderProps, 'createdAt' | 'updatedAt' | '_id' | 'currency'> {
  currency?: string;
}

export class Order {
  constructor(private props: OrderProps) {}

  public static reconstitute(props: OrderProps) {
    return new Order(props);
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

  get user() {
    return this.props.user;
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
