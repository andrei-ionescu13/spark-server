import mongoose from 'mongoose';
import { AssetDoc, AssetSchema } from '../../Asset';
import { Meta, MetaSchema } from '../../meta';
const { Schema } = mongoose;

type Status = 'draft' | 'published' | 'archived';

export interface ArticleDoc {
  title: string;
  description: string;
  slug: string;
  status: Status;
  category: string;
  markdown: string;
  cover: AssetDoc;
  meta: Meta;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  _id: string;
}

const ArticleSchema = new Schema<ArticleDoc>({
  _id: {
    type: String,
    required: true,
  },
  tags: [{ type: String, ref: 'ArticleTag' }],
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
  category: { type: String, ref: 'ArticleCategory' },
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

export const ArticleModel = mongoose.model<ArticleDoc>('Article', ArticleSchema);
