import mongoose from 'mongoose';
import { AssetSchema } from '../Asset';
const { Schema } = mongoose;

export interface Deal {
  cover: any;
  title: any;
  description: any;
  slug: any;
  startDate: any;
  endDate: any;
  meta: any;
  createdAt: any;
  updatedAt: any;
  products: any;
}

const DealSchema = new Schema<Deal>({
  cover: AssetSchema,
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  meta: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    keywords: [
      {
        type: String,
        required: true,
      },
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
});

export const DealModel = mongoose.model<Deal>('Deal', DealSchema);
