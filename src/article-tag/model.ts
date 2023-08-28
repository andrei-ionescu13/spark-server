import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface ArticleTag {
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
}

const ArticleTagSchema = new Schema<ArticleTag>({
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

export const ArticleTagModel = mongoose.model<ArticleTag>('ArticleTag', ArticleTagSchema);
