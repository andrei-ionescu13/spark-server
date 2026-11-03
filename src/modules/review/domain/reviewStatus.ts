import * as z from 'zod';
import { DomainValidationError } from '../../blog/article/domain/status';
import { ValueObject } from '../../../valueObject';
import { Result } from '../../../result';
import { zodDomainValidationError } from '../../../zodErrors';

type ReviewStatusValue = 'published' | 'unpublished' | 'flagged';

export class ReviewStatus extends ValueObject<{ value: ReviewStatusValue }> {
  constructor(props: { value: ReviewStatusValue }) {
    super(props);
  }

  static create(status: ReviewStatusValue): Result<ReviewStatus, DomainValidationError> {
    const schema = z.enum(['published', 'unpublished', 'flagged']);
    const validation = schema.safeParse(status);

    if (validation.error) return Result.fail(zodDomainValidationError(validation.error));

    return Result.ok(new ReviewStatus({ value: status }));
  }

  static reconstitute(status: ReviewStatusValue): ReviewStatus {
    return new ReviewStatus({ value: status });
  }

  get value() {
    return this.props.value;
  }
}
