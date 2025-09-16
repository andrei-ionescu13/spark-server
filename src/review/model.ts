import mongoose from 'mongoose';
const { Schema } = mongoose;

type Status = 'published' | 'unpublished' | 'flagged';

export interface ReviewDoc {
  userName: string;
  user: string;
  product: string;
  rating: number;
  content: string;
  createdAt: Date;
  status: Status;
  _id: string;
}

const ReviewSchema = new Schema<ReviewDoc>({
  _id: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  user: { type: String, ref: 'User' },
  product: { type: String, ref: 'Product' },
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

export const ReviewModel = mongoose.model<ReviewDoc>('Review', ReviewSchema);
