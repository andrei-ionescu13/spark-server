import * as z from 'zod';
import { DomainValidationError } from '../blog/article/status';
import { ValueObject } from '../../valueObject';
import { Result } from '../../Result';
import { zodDomainValidationError } from '../../zodErrors';

type KeyAvailabilityValue = 'available' | 'unavailable';

interface KeyAvailabilityProps {
  value: KeyAvailabilityValue;
}

export class KeyAvailability extends ValueObject<KeyAvailabilityProps> {
  private constructor(props: KeyAvailabilityProps) {
    super(props);
  }

  static create(
    availability?: KeyAvailabilityValue,
  ): Result<KeyAvailability, DomainValidationError> {
    const schema = z.enum(['available', 'unavailable']).optional();
    const result = schema.safeParse(availability);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    if (!availability) return Result.ok(new KeyAvailability({ value: 'available' }));

    return Result.ok(new KeyAvailability({ value: availability }));
  }

  get value() {
    return this.props.value;
  }
}
