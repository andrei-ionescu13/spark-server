import { Result } from '../../../result';
import { ValueObject } from '../../../valueObject';
import * as z from 'zod';
import { zodDomainValidationError } from '../../../zodErrors';
import { DomainValidationError } from '../../blog/article/domain/status';
import { OrderFulfillmentStatus } from './orderFulfillmentStatus';

type QuantityValue = number;

export class Quantity extends ValueObject<{ value: QuantityValue }> {
  constructor(props: { value: QuantityValue }) {
    super(props);
  }

  static create(value: QuantityValue = 1): Result<Quantity, DomainValidationError> {
    const schema = z.int().positive();

    const validation = schema.safeParse(value);
    if (validation.error) return Result.fail(zodDomainValidationError(validation.error));

    return Result.ok(new Quantity({ value }));
  }

  static reconstitute(value: QuantityValue): Quantity {
    return new Quantity({ value });
  }

  get value() {
    return this.props.value;
  }
}
