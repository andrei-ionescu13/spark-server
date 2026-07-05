import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface NamespaceDoc {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  translations: Array<{
    key: string;
    [key: string]: string;
  }>;
  _id: string;
}

export interface TranslationDoc {
  key: string;
  [lang: string]: string;
}

const TranslationSchema = new Schema<TranslationDoc>(
  {
    key: { type: String, required: true },
  },
  {
    _id: false,
    strict: false, // allow arbitrary language fields like en, fr, de
  },
);

const NamespaceSchema = new Schema<NamespaceDoc>({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  },
  translations: {
    type: [TranslationSchema],
    default: [],
  },
});

export const NamespaceModel = mongoose.model<NamespaceDoc>('Namespace', NamespaceSchema);
