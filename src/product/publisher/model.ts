import mongoose from 'mongoose';
import { AssetDoc, AssetSchema } from '../../Asset';
const { Schema } = mongoose;

export interface PublisherDoc {
  name: string;
  logo: AssetDoc;
  createdAt: Date;
  updatedAt: Date | null;
  _id: string;
  slug: string;
}

const PublisherSchema = new Schema<PublisherDoc>({
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

export const PublisherModel = mongoose.model<PublisherDoc>('Publisher', PublisherSchema);
