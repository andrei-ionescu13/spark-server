import * as z from 'zod';
import { DomainValidationError } from '../blog/article/status';
import { Result } from '../Result';
import { zodDomainValidationError } from '../zodErrors';
import { ReviewContent } from './reviewContent';
import { ReviewRating } from './reviewRating';
import { ReviewStatus } from './reviewStatus';

interface ReviewProps {
  userName: string;
  user: string;
  product: string;
  rating: ReviewRating;
  content: ReviewContent;
  createdAt: Date;
  status: ReviewStatus;
  _id: string;
}

export class Review {
  constructor(private props: ReviewProps) {}

  public static create(props: ReviewProps): Result<Review, DomainValidationError> {
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

    return Result.ok(new Review(props));
  }

  public updateStatus(status: ReviewStatus) {
    this.props.status = status;
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
