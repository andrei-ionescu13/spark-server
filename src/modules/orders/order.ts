import * as z from 'zod';
import { DomainValidationError } from '../blog/article/status';
import { Result } from '../../Result';
import { zodDomainValidationError } from '../../zodErrors';
import { OrderPaymentStatus } from './orderPaymentStatus';
import { OrderStatus } from './orderStatus';
import { OrderFulfillmentStatus } from './orderFulfillmentStatus';
import { LineItem } from './lineItem';

interface OrderProps {
  _id: string;
  status: OrderStatus;
  orderNumber: string;
  email: string;
  paymentStatus: OrderPaymentStatus;
  fulfillmentStatus: OrderFulfillmentStatus;
  customer: string;
  createdAt: Date;
  itemCount: number;
  totalPrice: number;
  totalDiscounts: number;
  lineItems: LineItem[];
}

export class Order {
  constructor(private props: OrderProps) {}

  static create(props: OrderProps): Result<Order, DomainValidationError> {
    const schema = z.object({
      _id: z.string(),
      orderNumber: z.string(),
      email: z.email(),
      customer: z.string(),
      createdAt: z.date(),
      itemCount: z.number(),
      totalPrice: z.number(),
      totalDiscounts: z.number(),
    });

    const validation = schema.safeParse(props);
    if (validation.error) {
      return Result.fail(zodDomainValidationError(validation.error));
    }

    return Result.ok(new Order(props));
  }
}
