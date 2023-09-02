import mongoose from 'mongoose';
import { Asset, AssetSchema } from '../Asset';
const { Schema } = mongoose;

export interface Publisher {
  name: string;
  logo: Asset;
  createdAt: Date;
  updatedAt: Date | null;
}

const PublisherSchema = new Schema<Publisher>({
  name: {
    type: String,
    required: true,
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

export const PublisherModel = mongoose.model<Publisher>('Publisher', PublisherSchema);
