import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface GenreDoc {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
}

const GenreSchema = new Schema<GenreDoc>({
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

export const GenreModel = mongoose.model<GenreDoc>('Genre', GenreSchema);
