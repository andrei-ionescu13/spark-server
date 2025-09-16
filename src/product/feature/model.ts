import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface FeatureDoc {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
}

const FeatureSchema = new Schema<FeatureDoc>({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

export const FeatureModel = mongoose.model<FeatureDoc>('Feature', FeatureSchema);
