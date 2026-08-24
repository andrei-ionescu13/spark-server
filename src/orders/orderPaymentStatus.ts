import { DomainValidationError } from '../blog/article/status';
import { Result } from '../Result';
import { ValueObject } from '../valueObject';
import * as z from 'zod';
import { zodDomainValidationError } from '../zodErrors';

type OrderPaymentStatusValue = 'authorized' | 'paid' | 'pending' | 'refunded' | 'expired';

export class OrderPaymentStatus extends ValueObject<{ value: OrderPaymentStatusValue }> {
  constructor(props: { value: OrderPaymentStatusValue }) {
    super(props);
  }

  static create(value: OrderPaymentStatusValue): Result<OrderPaymentStatus, DomainValidationError> {
    const schema = z.enum(['authorized', 'paid', 'pending', 'refunded', 'expired']);

    const validation = schema.safeParse(value);
    if (validation.error) return Result.fail(zodDomainValidationError(validation.error));

    return Result.ok(new OrderPaymentStatus({ value }));
  }

  get value() {
    return this.props.value;
  }
}
