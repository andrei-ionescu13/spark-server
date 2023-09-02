import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface TranslationsLanguage {
  name: string;
  code: string;
  nativeName: string;
}

const TranslationsLanguageSchema = new Schema<TranslationsLanguage>({
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

export const TranslationsLanguageModel = mongoose.model<TranslationsLanguage>(
  'TranslationsLanguage',
  TranslationsLanguageSchema,
);
