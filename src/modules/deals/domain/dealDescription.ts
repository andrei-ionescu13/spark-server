import { DomainValidationError } from '../../blog/article/domain/status';
import { ValueObject } from '../../../valueObject';
import * as z from 'zod';
import { zodDomainValidationError } from '../../../zodErrors';
import { Result } from '../../../result';

export class DealDescription extends ValueObject<{ value: string }> {
  constructor(props: { value: string }) {
    super(props);
  }

  static create(value: string): Result<DealDescription, DomainValidationError> {
    const schema = z.string().min(8);
    const validation = schema.safeParse(value);

    if (validation.error) return Result.fail(zodDomainValidationError(validation.error));

    return Result.ok(new DealDescription({ value }));
  }

  static reconstitute(value: string): DealDescription {
    return new DealDescription({ value });
  }

  get value() {
    return this.props.value;
  }
}
