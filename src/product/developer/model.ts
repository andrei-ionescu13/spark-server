import mongoose from 'mongoose';
import { AssetDoc, AssetSchema } from '../../Asset';
const { Schema } = mongoose;

export interface DeveloperDoc {
  name: string;
  logo: AssetDoc;
  createdAt: Date;
  updatedAt: Date | null;
  _id: string;
  slug: string;
}

const DeveloperSchema = new Schema<DeveloperDoc>({
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

export const DeveloperModel = mongoose.model<DeveloperDoc>('Developer', DeveloperSchema);
