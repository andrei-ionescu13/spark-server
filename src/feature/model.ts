import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface Feature {
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
}

const FeatureSchema = new Schema<Feature>({
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

export const FeatureModel = mongoose.model<Feature>('Feature', FeatureSchema);
