import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface Meta {
  title: string;
  description: string;
  keywords: string[];
}

export const MetaSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  keywords: [
    {
      type: String,
      required: true,
    },
  ],
});
