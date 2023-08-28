import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface Developer {
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
}

const DeveloperSchema = new Schema<Developer>({
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

export const DeveloperModel = mongoose.model<Developer>('Developer', DeveloperSchema);
