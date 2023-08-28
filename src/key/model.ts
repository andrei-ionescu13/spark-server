import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface Key {
  product: any;
  createdAt: any;
  value: any;
  availability: any;
  status: any;
}

const KeySchema = new Schema<Key>({
  product: {
    type: Schema.Types.ObjectId,
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

export const KeyModel = mongoose.model<Key>('Key', KeySchema);
