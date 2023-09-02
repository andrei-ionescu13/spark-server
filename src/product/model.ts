import mongoose from 'mongoose';
import { AssetSchema } from '../Asset';
const { Schema } = mongoose;

export interface Product {
  cover: any;
  images: any;
  selectedImages: any;
  videos: any;
  status: any;
  title: any;
  price: any;
  genres: any;
  releaseDate: any;
  createdAt: any;
  updatedAt: any;
  publisher: any;
  platform: any;
  developers: any;
  languages: any;
  features: any;
  link: any;
  os: any;
  markdown: any;
  metaTitle: any;
  metaDescription: any;
  minimumRequirements: any;
  recommendedRequirements: any;
  slug: any;
  metaKeywords: any;
  keys: any;
  rating: any;
  reviews: any;
  discount: any;
}

const ProductSchema = new Schema<Product>({
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
  genres: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
  releaseDate: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  publisher: { type: Schema.Types.ObjectId, ref: 'Publisher' },
  platform: { type: Schema.Types.ObjectId, ref: 'Platform' },
  developers: [{ type: Schema.Types.ObjectId, ref: 'Developer' }],
  features: [{ type: Schema.Types.ObjectId, ref: 'Feature' }],
  languages: [{ type: Schema.Types.ObjectId, ref: 'Language' }],
  link: String,
  os: [{ type: Schema.Types.ObjectId, ref: 'OperatingSystem' }],
  markdown: String,
  metaTitle: String,
  metaDescription: String,
  minimumRequirements: String,
  recommendedRequirements: String,
  slug: String,
  metaKeywords: [String],
  keys: [{ type: Schema.Types.ObjectId, ref: 'Key', default: [] }],
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
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review', default: [] }],
  discount: {
    type: Schema.Types.ObjectId,
    ref: 'Discount',
    default: null,
  },
});

export const ProductModel = mongoose.model<Product>('Product', ProductSchema);
