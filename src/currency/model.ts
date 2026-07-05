import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface CurrencyDoc {
  name: string;
  code: string;
  symbol: string;
  _id: string;
}

const CurrencySchema = new Schema<CurrencyDoc>({
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
  symbol: {
    type: String,
    required: true,
    unique: true,
  },
});

export const CurrencyModel = mongoose.model<CurrencyDoc>('Currency', CurrencySchema);
