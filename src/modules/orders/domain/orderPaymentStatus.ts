import * as z from 'zod';
import { DomainValidationError } from '../../blog/article/domain/status';
import { Result } from '../../../results';
import { ValueObject } from '../../../valueObject';
import { zodDomainValidationError } from '../../../zodErrors';

type OrderPaymentStatusValue = 'authorized' | 'paid' | 'pending' | 'refunded' | 'expired';

export class OrderPaymentStatus extends ValueObject<{ value: OrderPaymentStatusValue }> {
  constructor(props: { value: OrderPaymentStatusValue }) {
    super(props);
  }

  static create(
    value: OrderPaymentStatusValue = 'pending',
  ): Result<OrderPaymentStatus, DomainValidationError> {
    const schema = z.enum(['authorized', 'paid', 'pending', 'refunded', 'expired']);

    const validation = schema.safeParse(value);
    if (validation.error) return Result.fail(zodDomainValidationError(validation.error));

    return Result.ok(new OrderPaymentStatus({ value }));
  }

  static reconstitute(value: OrderPaymentStatusValue): OrderPaymentStatus {
    return new OrderPaymentStatus({ value });
  }

  get value() {
    return this.props.value;
  }
}
