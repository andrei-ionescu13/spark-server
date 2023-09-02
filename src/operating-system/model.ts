import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface OperatingSystem {
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
}

const OperatingSystemSchema = new Schema<OperatingSystem>({
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

export const OperatingSystemModel = mongoose.model<OperatingSystem>(
  'OperatingSystem',
  OperatingSystemSchema,
);
