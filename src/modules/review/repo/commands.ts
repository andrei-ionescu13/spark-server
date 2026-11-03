import { ReviewDoc } from '../model';
import { Review } from '../domain/review';
import { ReviewMapper } from '../reviewMapper';
import { Collection } from 'mongodb';

export interface ReviewCommandsRepoI {
  save: (review: Review) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  deleteReviews: (ids: string[]) => Promise<void>;
  getReview: (id: string) => Promise<Review | null>;
  getReviews: (ids: string[]) => Promise<Review[]>;
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

  getReview = async (id: string): Promise<Review | null> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return null;

    const review = ReviewMapper.toDomain(doc);
    return review;
  };

  getReviews = async (ids: string[]): Promise<Review[]> => {
    const docs = await this.collection.find({ _id: { $in: ids } }).toArray();
    const reviews = ReviewMapper.toDomainList(docs);
    return reviews;
  };
}
