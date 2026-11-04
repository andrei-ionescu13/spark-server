import * as z from 'zod';
import { DomainValidationError } from '../../blog/article/domain/status';
import { Result } from '../../../results';
import { ValueObject } from '../../../valueObject';
import { zodDomainValidationError } from '../../../zodErrors';

type OrderStatusValue = 'open' | 'archived' | 'canceled';

export class OrderStatus extends ValueObject<{ value: OrderStatusValue }> {
  constructor(props: { value: OrderStatusValue }) {
    super(props);
  }

  static create(value: OrderStatusValue = 'open'): Result<OrderStatus, DomainValidationError> {
    const schema = z.enum(['open', 'archived', 'canceled']);

    const validation = schema.safeParse(value);
    if (validation.error) return Result.fail(zodDomainValidationError(validation.error));

    return Result.ok(new OrderStatus({ value }));
  }

  static reconstitute(value: OrderStatusValue): OrderStatus {
    return new OrderStatus({ value });
  }

  get value() {
    return this.props.value;
  }
}
