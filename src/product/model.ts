import mongoose from 'mongoose';
import { AssetSchema } from '../Asset';
import { Asset } from '../blog/article/asset';
import { MetaDoc, MetaSchema } from '../Meta';
const { Schema } = mongoose;

type Status = 'draft' | 'published' | 'archived';

export interface ProductDoc {
  _id: string;
  cover: Asset;
  images: Asset[];
  selectedImages: Asset[];
  videos: string[];
  status: Status;
  title: string;
  price: number;
  genres: string[];
  releaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
  publisher: string;
  platform: string;
  developers: string[];
  features: string[];
  link: string;
  os: string;
  markdown: string;
  meta: MetaDoc;
  minimumRequirements: string;
  recommendedRequirements: string;
  slug: string;
  keys: string[];
  rating: {
    average: number;
    distribution: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
  };
  reviews: string[];
  discount: string;
}

const ProductSchema = new Schema<ProductDoc>({
  _id: {
    type: String,
    requi: true,
    unique: true,
  },
  cover: AssetSchema,
  images: [AssetSchema],
  selectedImages: [AssetSchema],
  videos: [String],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  title: String,
  price: Number,
  genres: [{ type: String, ref: 'Genre' }],
  releaseDate: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  publisher: { type: String, ref: 'Publisher' },
  platform: { type: String, ref: 'Platform' },
  developers: [{ type: String, ref: 'Developer' }],
  features: [{ type: String, ref: 'Feature' }],
  link: String,
  os: [{ type: String, ref: 'OperatingSystem' }],
  markdown: String,
  minimumRequirements: String,
  recommendedRequirements: String,
  slug: String,
  meta: MetaSchema,
  keys: [{ type: String, ref: 'Key', default: [] }],
  rating: {
    average: {
      type: Number,
      default: 0,
    },
    distribution: {
      1: {
        type: Number,
        default: 0,
      },
      2: {
        type: Number,
        default: 0,
      },
      3: {
        type: Number,
        default: 0,
      },
      4: {
        type: Number,
        default: 0,
      },
      5: {
        type: Number,
        default: 0,
      },
    },
  },
  reviews: [{ type: String, ref: 'Review', default: [] }],
  discount: {
    type: String,
    ref: 'Discount',
    default: null,
  },
});

export const ProductModel = mongoose.model<ProductDoc>('Product', ProductSchema);
