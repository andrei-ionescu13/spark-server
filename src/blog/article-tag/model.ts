import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface ArticleTagEntity {
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
  _id: string;
}

const ArticleTagSchema = new Schema<ArticleTagEntity>({
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

export const ArticleTagModel = mongoose.model<ArticleTagEntity>('ArticleTag', ArticleTagSchema);
