import * as z from 'zod';
import { Result } from '../../Result';
import { zodDomainValidationError } from '../../zodErrors';
import { ValueObject } from '../../valueObject';

export class DomainValidationError extends Error {
  constructor(public readonly message: string) {
    super(message);
  }
}

export class MappingValidationError extends Error {
  constructor(public readonly message: string) {
    super(message);
  }
}

export class RequestValidationError extends Error {
  constructor(public readonly message: string) {
    super(message);
  }
}

interface StatusProps {
  value: 'draft' | 'published' | 'archived';
}

export class Status extends ValueObject<StatusProps> {
  private constructor(props: StatusProps) {
    super(props);
  }

  static create(props: StatusProps): Result<Status, DomainValidationError> {
    const schema = z.enum(['draft', 'published', 'archived']);
    const result = schema.safeParse(props.value);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new Status(props));
  }

  isDraft() {
    return this.props.value === 'draft';
  }

  isPublished() {
    return this.props.value === 'published';
  }

  isArchived() {
    return this.props.value === 'archived';
  }

  get value() {
    return this.props.value;
  }
}
