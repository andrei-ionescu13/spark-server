import mongoose from 'mongoose';
import { Asset, AssetSchema } from '../Asset';
const { Schema } = mongoose;

export interface Platform {
  name: String;
  logo: Asset;
}

const PlatformSchema = new Schema<Platform>({
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: AssetSchema,
    required: true,
  },
});

export const PlatformModel = mongoose.model<Platform>('Platform', PlatformSchema);
