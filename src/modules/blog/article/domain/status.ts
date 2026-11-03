import * as z from 'zod';
import { zodDomainValidationError } from '../../../../zodErrors';
import { ValueObject } from '../../../../valueObject';
import { Result } from '../../../../result';

type StatusPropsValue = 'draft' | 'published' | 'archived';

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
  value: StatusPropsValue;
}

export class ArticleStatus extends ValueObject<StatusProps> {
  private constructor(props: StatusProps) {
    super(props);
  }

  static create(status: StatusPropsValue): Result<ArticleStatus, DomainValidationError> {
    const schema = z.enum(['draft', 'published', 'archived']);
    const result = schema.safeParse(status);

    if (result.error) {
      console.log(result.error);
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new ArticleStatus({ value: status }));
  }

  public static reconstitute(status: StatusPropsValue) {
    return new ArticleStatus({ value: status });
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
