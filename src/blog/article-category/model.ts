import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface ArticleCategoryDoc {
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
  _id: string;
}

const ArticleCategorySchema = new Schema<ArticleCategoryDoc>({
  _id: {
    type: String,
    required: true,
  },
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

export const ArticleCategoryModel = mongoose.model<ArticleCategoryDoc>(
  'ArticleCategory',
  ArticleCategorySchema,
);
