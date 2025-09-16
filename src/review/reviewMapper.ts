import { DomainValidationError } from '../blog/article/status';
import { Result } from '../Result';
import { UserDto } from '../users/userMapper';
import { ReviewDoc } from './model';
import { Review } from './review';
import { ReviewContent } from './reviewContent';
import { ReviewRating } from './reviewRating';
import { ReviewStatus } from './reviewStatus';

type Status = 'published' | 'unpublished' | 'flagged';

export interface ReviewPersistance {
  userName: string;
  user: string;
  product: string;
  rating: number;
  content: string;
  createdAt: Date;
  status: Status;
  _id: string;
}

export interface ReviewDto {
  userName: string;
  user: UserDto;
  //change this
  product: any;
  rating: number;
  content: string;
  createdAt: Date;
  status: Status;
  _id: string;
}

export class ReviewMapper {
  static toDomain(entity: ReviewDoc): Result<Review, DomainValidationError> {
    const contentOrError = ReviewContent.create(entity.content);
    const ratingOrError = ReviewRating.create(entity.rating);
    const statusOrError = ReviewStatus.create(entity.status);

    const result = Result.combine([contentOrError, ratingOrError, statusOrError]);

    if (result.isErr()) {
      return Result.fail(new DomainValidationError(result.error.message));
    }

    const content = contentOrError.value;
    const rating = ratingOrError.value;
    const status = statusOrError.value;

    const reviewOrError = Review.create({
      userName: entity.userName,
      user: entity.user,
      product: entity.product,
      createdAt: entity.createdAt,
      _id: entity._id,
      content: content,
      rating: rating,
      status: status,
    });

    if (reviewOrError.isErr()) {
      return Result.fail(new DomainValidationError(reviewOrError.error.message));
    }
    const review = reviewOrError.value;

    return Result.ok(review);
  }

  static toDto(entity: any): ReviewDto {
    return {
      userName: entity.userName,
      user: entity.user,
      product: entity.product,
      rating: entity.rating,
      content: entity.content,
      createdAt: entity.createdAt,
      status: entity.status,
      _id: entity._id,
    };
  }

  static toDtoList(entities: any[]): ReviewDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toPersistance(entity: Review): ReviewPersistance {
    return {
      userName: entity.userName,
      user: entity.user,
      product: entity.product,
      rating: entity.rating.value,
      content: entity.content.value,
      createdAt: entity.createdAt,
      status: entity.status.value,
      _id: entity._id,
    };
  }
}
