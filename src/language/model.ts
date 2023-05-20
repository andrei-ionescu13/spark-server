import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface Language {
  name: string;
  code: string;
  nativeName: string;
}

const LanguageSchema = new Schema<Language>({
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

export const LanguageModel = mongoose.model<Language>('Language', LanguageSchema);
