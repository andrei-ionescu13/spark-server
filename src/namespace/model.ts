import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface Namespace {
  name: string;
  createdAt: Date;
  updatedAt?: Date;
  translations: any;
}

const NamespaceSchema = new Schema<Namespace>({
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  },
  translations: {
    type: Array,
    default: [],
  },
});

export const NamespaceModel = mongoose.model<Namespace>('Namespace', NamespaceSchema);
