import * as z from 'zod';
import { Result } from '../../Result';
import { zodDomainValidationError } from '../../zodErrors';
import { DomainValidationError } from './status';
import { ValueObject } from '../../valueObject';

interface DescriptionProps {
  value: string;
}

export class Description extends ValueObject<DescriptionProps> {
  private constructor(props: DescriptionProps) {
    super(props);
  }

  static create(props: DescriptionProps): Result<Description, DomainValidationError> {
    const schema = z.string().min(24).max(120);
    const result = schema.safeParse(props.value);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new Description(props));
  }

  get value() {
    return this.props.value;
  }
}
