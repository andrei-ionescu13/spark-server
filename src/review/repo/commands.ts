import { Model } from 'mongoose';
import { DomainValidationError } from '../../blog/article/status';
import { Result } from '../../Result';
import { ReviewDoc } from '../model';
import { Review } from '../review';
import { ReviewMapper } from '../reviewMapper';

export interface ReviewCommandsRepoI {
  save: (review: Review) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  deleteReviews: (ids: string[]) => Promise<void>;
  getReview: (id: string) => Promise<Result<Review | null, DomainValidationError>>;
}

export class ReviewCommandsRepo implements ReviewCommandsRepoI {
  constructor(private reviewModel: Model<ReviewDoc>) {}

  save = async (review: Review): Promise<void> => {
    const persistence = ReviewMapper.toPersistance(review);
    await this.reviewModel.updateOne({ _id: review._id }, { $set: persistence }, { upsert: true });
  };

  deleteReview = async (id: string): Promise<void> => {
    await this.reviewModel.deleteOne({ _id: id });
  };

  deleteReviews = async (ids: string[]): Promise<void> => {
    await this.reviewModel.deleteMany({ _id: { $in: ids } });
  };

  getReview = async (id: String): Promise<Result<Review | null, DomainValidationError>> => {
    const doc = await this.reviewModel.findOne({ _id: id }).populate('product user').lean();
    if (!doc) return Result.ok(null);

    const reviewOrError = ReviewMapper.toDomain(doc);

    if (reviewOrError.isErr()) {
      return Result.fail(new DomainValidationError(reviewOrError.error.message));
    }
    const review = reviewOrError.value;

    return Result.ok(review);
  };
}
