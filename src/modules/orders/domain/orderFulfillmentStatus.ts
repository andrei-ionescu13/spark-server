import * as z from 'zod';
import { DomainValidationError } from '../../blog/article/domain/status';
import { Result } from '../../../result';
import { ValueObject } from '../../../valueObject';
import { zodDomainValidationError } from '../../../zodErrors';

type OrderFulfillmentStatusValue = 'fulfilled' | 'unfulfilled' | 'partially fulfilled';

export class OrderFulfillmentStatus extends ValueObject<{ value: OrderFulfillmentStatusValue }> {
  constructor(props: { value: OrderFulfillmentStatusValue }) {
    super(props);
  }

  static create(
    value: OrderFulfillmentStatusValue = 'unfulfilled',
  ): Result<OrderFulfillmentStatus, DomainValidationError> {
    const schema = z.enum(['fulfilled', 'unfulfilled', 'partially fulfilled']);

    const validation = schema.safeParse(value);
    if (validation.error) return Result.fail(zodDomainValidationError(validation.error));

    return Result.ok(new OrderFulfillmentStatus({ value }));
  }

  static reconstitute(value: OrderFulfillmentStatusValue): OrderFulfillmentStatus {
    return new OrderFulfillmentStatus({ value });
  }

  get value() {
    return this.props.value;
  }
}
