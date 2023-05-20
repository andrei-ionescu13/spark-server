import mongoose from 'mongoose';
import { AssetSchema } from '../Asset';
const { Schema } = mongoose;

export interface Collection {
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
  isDeal: any;
}

const CollectionSchema = new Schema<Collection>({
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
  isDeal: {
    type: Boolean,
    default: false,
  },
});

export const CollectionModel = mongoose.model<Collection>('Collection', CollectionSchema);
