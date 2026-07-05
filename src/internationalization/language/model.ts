import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface LanguageDoc {
  name: string;
  code: string;
  nativeName: string;
  _id: string;
}

const LanguageSchema = new Schema<LanguageDoc>({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  nativeName: {
    type: String,
    required: true,
    unique: true,
  },
});

export const LanguageModel = mongoose.model<LanguageDoc>('Language', LanguageSchema);
