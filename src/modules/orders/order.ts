import * as z from 'zod';
import { DomainValidationError } from '../blog/article/status';
import { zodDomainValidationError } from '../../zodErrors';
import { OrderPaymentStatus } from './orderPaymentStatus';
import { OrderStatus } from './orderStatus';
import { OrderFulfillmentStatus } from './orderFulfillmentStatus';
import { LineItem } from './lineItem';
import { v7 as uuid7 } from 'uuid';
import { Result } from '../../result';

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
  updatedAt: Date | null;
}

interface CreateOrderProps extends Omit<OrderProps, 'createdAt' | 'updatedAt' | '_id'> {}

export class Order {
  constructor(private props: OrderProps) {}

  static create(props: CreateOrderProps): Result<Order, DomainValidationError> {
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

    return Result.ok(
      new Order({
        ...props,
        createdAt: new Date(),
        updatedAt: null,
        _id: uuid7(),
      }),
    );
  }

  public static reconstitute(props: OrderProps) {
    return new Order(props);
  }
}
