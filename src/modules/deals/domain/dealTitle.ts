import { DomainValidationError } from '../../blog/article/domain/status';
import { ValueObject } from '../../../valueObject';
import * as z from 'zod';
import { zodDomainValidationError } from '../../../zodErrors';
import { Result } from '../../../result';

export class DealTitle extends ValueObject<{ value: string }> {
  constructor(props: { value: string }) {
    super(props);
  }

  static create(value: string): Result<DealTitle, DomainValidationError> {
    const schema = z.string().min(1);
    const validation = schema.safeParse(value);

    if (validation.error) return Result.fail(zodDomainValidationError(validation.error));

    return Result.ok(new DealTitle({ value }));
  }

  static reconstitute(value: string): DealTitle {
    return new DealTitle({ value });
  }

  get value() {
    return this.props.value;
  }
}
