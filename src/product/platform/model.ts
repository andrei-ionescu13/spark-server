import mongoose from 'mongoose';
import { AssetDoc, AssetSchema } from '../../Asset';
const { Schema } = mongoose;

export interface PlatformDoc {
  name: string;
  logo: AssetDoc;
  createdAt: Date;
  updatedAt: Date | null;
  _id: string;
  slug: string;
  url: string;
}

const PlatformSchema = new Schema<PlatformDoc>({
  _id: {
    type: String,
    required: true,
    unique: true,
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
  logo: {
    type: AssetSchema,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

export const PlatformModel = mongoose.model<PlatformDoc>('Platform', PlatformSchema);
