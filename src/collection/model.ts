import mongoose from 'mongoose';
import { AssetDoc, AssetSchema } from '../Asset';
import { MetaDoc } from '../Meta';
const { Schema } = mongoose;

export interface CollectionDoc {
  cover: AssetDoc;
  title: string;
  description: string | null;
  slug: string;
  startDate: Date;
  endDate: Date;
  meta: MetaDoc;
  createdAt: Date;
  updatedAt: Date;
  products: string[];
  isDeal: boolean;
  _id: string;
}

const CollectionSchema = new Schema<CollectionDoc>({
  cover: AssetSchema,
  _id: {
    type: String,
    required: true,
    unique: true,
  },
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

export const CollectionModel = mongoose.model<CollectionDoc>('Collection', CollectionSchema);
