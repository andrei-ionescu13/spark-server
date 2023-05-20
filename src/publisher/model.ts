import mongoose from 'mongoose';
import { Asset, AssetSchema } from '../Asset';
const { Schema } = mongoose;

export interface Publisher {
  name: string;
  logo: Asset;
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
});

export const PublisherModel = mongoose.model<Publisher>('Publisher', PublisherSchema);
