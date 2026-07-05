import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface OperatingSystemDoc {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
}

const OperatingSystemSchema = new Schema<OperatingSystemDoc>({
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

export const OperatingSystemModel = mongoose.model<OperatingSystemDoc>(
  'OperatingSystem',
  OperatingSystemSchema,
);
