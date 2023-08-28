import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface ArticleCategory {
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
}

const ArticleCategorySchema = new Schema<ArticleCategory>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

export const ArticleCategoryModel = mongoose.model<ArticleCategory>(
  'ArticleCategory',
  ArticleCategorySchema,
);
