import { DomainValidationError, MappingValidationError } from '../blog/article/domain/status';
import { UserDto } from '../users/userMapper';
import { ReviewDoc } from './model';
import { Review } from './domain/review';
import { ReviewContent } from './domain/reviewContent';
import { ReviewRating } from './domain/reviewRating';
import { ReviewStatus } from './domain/reviewStatus';

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
  static toDomain(entity: ReviewDoc): Review {
    const content = ReviewContent.reconstitute(entity.content);
    const rating = ReviewRating.reconstitute(entity.rating);
    const status = ReviewStatus.reconstitute(entity.status);
    const review = Review.reconstitute({
      userName: entity.userName,
      user: entity.user,
      product: entity.product,
      createdAt: entity.createdAt,
      _id: entity._id,
      updatedAt: entity.updatedAt,
      content: content,
      rating: rating,
      status: status,
    });

    return review;
  }

  static toDomainList(docs: ReviewDoc[]): Review[] {
    const reviews = docs.map((entity) => this.toDomain(entity));
    return reviews;
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
