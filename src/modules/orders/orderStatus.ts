import { DomainValidationError } from '../blog/article/status';
import { Result } from '../../Result';
import { ValueObject } from '../../valueObject';
import * as z from 'zod';
import { zodDomainValidationError } from '../../zodErrors';

type OrderStatusValue = 'open' | 'archived' | 'canceled';

export class OrderStatus extends ValueObject<{ value: OrderStatusValue }> {
  constructor(props: { value: OrderStatusValue }) {
    super(props);
  }

  static create(value: OrderStatusValue): Result<OrderStatus, DomainValidationError> {
    const schema = z.enum(['open', 'archived', 'canceled']);

    const validation = schema.safeParse(value);
    if (validation.error) return Result.fail(zodDomainValidationError(validation.error));

    return Result.ok(new OrderStatus({ value }));
  }

  get value() {
    return this.props.value;
  }
}
