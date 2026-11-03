import * as z from 'zod';
import { DomainValidationError } from '../../blog/article/domain/status';
import { zodDomainValidationError } from '../../../zodErrors';
import { ReviewContent } from '../reviewContent';
import { ReviewRating } from '../reviewRating';
import { ReviewStatus } from '../reviewStatus';
import { v7 as uuid7 } from 'uuid';
import { Result } from '../../../result';

interface ReviewProps {
  userName: string;
  user: string;
  product: string;
  rating: ReviewRating;
  content: ReviewContent;
  createdAt: Date;
  status: ReviewStatus;
  _id: string;
  updatedAt: Date | null;
}

interface CreateReviewProps extends Omit<ReviewProps, 'createdAt' | 'updatedAt' | '_id'> {}

export class Review {
  constructor(private props: ReviewProps) {}

  public static create(props: CreateReviewProps): Result<Review, DomainValidationError> {
    const schema = z.object({
      userName: z.string(),
      _id: z.string(),
      user: z.string(),
      product: z.string(),
      createdAt: z.date(),
    });

    const result = schema.safeParse(props);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(
      new Review({
        ...props,
        createdAt: new Date(),
        updatedAt: null,
        _id: uuid7(),
      }),
    );
  }

  public static reconstitute(props: ReviewProps) {
    return new Review(props);
  }

  public updateStatus(status: ReviewStatus) {
    this.props.status = status;
    this.props.updatedAt = new Date();
  }

  get userName() {
    return this.props.userName;
  }

  get user() {
    return this.props.user;
  }

  get product() {
    return this.props.product;
  }

  get rating() {
    return this.props.rating;
  }

  get content() {
    return this.props.content;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get status() {
    return this.props.status;
  }

  get _id() {
    return this.props._id;
  }
}
