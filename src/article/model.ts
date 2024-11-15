import mongoose from 'mongoose';
import { Asset, AssetSchema } from '../Asset';
import { Meta, MetaSchema } from '../Meta';
const { Schema } = mongoose;

type Status = 'draft' | 'published' | 'archived';

export interface Article {
  title: string;
  description: string;
  slug: string;
  status: Status;
  category: any;
  markdown: string;
  cover: Asset;
  meta: Meta;
  createdAt: Date;
  updatedAt: Date;
  tags: any;
}

const ArticleSchema = new Schema<Article>({
  tags: [{ type: Schema.Types.ObjectId, ref: 'ArticleTag' }],
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
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  category: { type: Schema.Types.ObjectId, ref: 'ArticleCategory' },
  markdown: {
    type: String,
    required: true,
  },
  cover: AssetSchema,
  meta: MetaSchema,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

export const ArticleModel = mongoose.model<Article>('Article', ArticleSchema);
