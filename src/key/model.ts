import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface KeyDoc {
  product: string;
  createdAt: Date;
  value: string;
  availability: 'available' | 'unavailable';
  status: 'secret' | 'revealed' | 'reported';
  _id: string;
}

const KeySchema = new Schema<KeyDoc>({
  _id: {
    type: String,
    required: true,
  },
  product: {
    type: String,
    ref: 'Product',
    required: true,
  },
  createdAt: {
    default: Date.now(),
    type: Date,
  },
  value: {
    type: String,
    required: true,
  },
  availability: {
    type: String,
    enum: ['available', 'unavailable'],
    default: 'available',
  },
  status: {
    type: String,
    enum: ['secret', 'revealed', 'reported'],
    default: 'secret',
  },
});

export const KeyModel = mongoose.model<KeyDoc>('Key', KeySchema);
