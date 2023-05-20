import mongoose, { ObjectId } from 'mongoose';
const { Schema } = mongoose;

type Status = 'published' | 'unpublished' | 'flagged';

export interface Review {
  userName: string;
  user: ObjectId;
  product: ObjectId;
  rating: number;
  content: string;
  createdAt: Date;
  status: Status;
}

const ReviewSchema = new Schema<Review>({
  userName: {
    type: String,
    required: true,
  },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
  rating: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['published', 'unpublished', 'flagged'],
    default: 'published',
  },
});

export const ReviewModel = mongoose.model<Review>('Review', ReviewSchema);
