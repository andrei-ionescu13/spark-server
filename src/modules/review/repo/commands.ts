import { DomainValidationError } from '../../blog/article/status';
import { Result } from '../../../Result';
import { ReviewDoc } from '../model';
import { Review } from '../review';
import { ReviewMapper } from '../reviewMapper';
import { Collection } from 'mongodb';

export interface ReviewCommandsRepoI {
  save: (review: Review) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  deleteReviews: (ids: string[]) => Promise<void>;
  getReview: (id: string) => Promise<Result<Review | null, DomainValidationError>>;
}

export class ReviewCommandsRepo implements ReviewCommandsRepoI {
  constructor(private collection: Collection<ReviewDoc>) {}

  save = async (review: Review): Promise<void> => {
    const persistence = ReviewMapper.toPersistance(review);
    await this.collection.updateOne({ _id: review._id }, { $set: persistence }, { upsert: true });
  };

  deleteReview = async (id: string): Promise<void> => {
    await this.collection.deleteOne({ _id: id });
  };

  deleteReviews = async (ids: string[]): Promise<void> => {
    await this.collection.deleteMany({ _id: { $in: ids } });
  };

  getReview = async (id: string): Promise<Result<Review | null, DomainValidationError>> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return Result.ok(null);

    const reviewOrError = ReviewMapper.toDomain(doc);

    if (reviewOrError.isErr()) {
      return Result.fail(new DomainValidationError(reviewOrError.error.message));
    }
    const review = reviewOrError.value;

    return Result.ok(review);
  };

  getReviews = async (ids: string[]): Promise<Result<Review[], DomainValidationError>> => {
    const docs = await this.collection.find({ _id: { $in: ids } }).toArray();
    const reviewsOrError = ReviewMapper.toDomainList(docs);

    if (reviewsOrError.isErr()) {
      return Result.fail(new DomainValidationError(reviewsOrError.error.message));
    }
    const reviews = reviewsOrError.value;
    return Result.ok(reviews);
  };
}
