import { DomainValidationError } from '../blog/article/status';
import { Result } from '../../Result';
import { ValueObject } from '../../valueObject';
import * as z from 'zod';
import { zodDomainValidationError } from '../../zodErrors';

type OrderFulfillmentStatusValue = 'fulfilled' | 'unfulfilled' | 'partially fulfilled';

export class OrderFulfillmentStatus extends ValueObject<{ value: OrderFulfillmentStatusValue }> {
  constructor(props: { value: OrderFulfillmentStatusValue }) {
    super(props);
  }

  static create(
    value: OrderFulfillmentStatusValue,
  ): Result<OrderFulfillmentStatus, DomainValidationError> {
    const schema = z.enum(['fulfilled', 'unfulfilled', 'partially fulfilled']);

    const validation = schema.safeParse(value);
    if (validation.error) return Result.fail(zodDomainValidationError(validation.error));

    return Result.ok(new OrderFulfillmentStatus({ value }));
  }

  get value() {
    return this.props.value;
  }
}
