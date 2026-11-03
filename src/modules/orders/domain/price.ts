import { Result } from '../../../result';
import { ValueObject } from '../../../valueObject';
import * as z from 'zod';
import { zodDomainValidationError } from '../../../zodErrors';
import { DomainValidationError } from '../../blog/article/domain/status';
import { OrderFulfillmentStatus } from './orderFulfillmentStatus';

type PriceValue = number;

export class Price extends ValueObject<{ value: PriceValue }> {
  constructor(props: { value: PriceValue }) {
    super(props);
  }

  static create(value: PriceValue): Result<Price, DomainValidationError> {
    const schema = z.number().nonnegative();

    const validation = schema.safeParse(value);
    if (validation.error) return Result.fail(zodDomainValidationError(validation.error));

    return Result.ok(new Price({ value }));
  }

  static reconstitute(value: PriceValue): Price {
    return new Price({ value });
  }

  get value() {
    return this.props.value;
  }
}
