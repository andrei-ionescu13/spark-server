import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface Currency {
  name: string;
  code: string;
  symbol: string;
}

const CurrencySchema = new Schema<Currency>({
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

export const CurrencyModel = mongoose.model<Currency>('Currency', CurrencySchema);
