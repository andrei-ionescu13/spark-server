import { Model } from 'mongoose';
import { Currency } from '../currency';
import { CurrencyMapper } from '../currencyMapper';
import { CurrencyDoc } from '../model';

export interface CurrencyCommandsRepoI {
  save: (language: Currency) => Promise<void>;
  deleteCurrency: (id: string) => Promise<void>;
}

export class CurrencyCommandsRepo implements CurrencyCommandsRepoI {
  constructor(private currencyModel: Model<CurrencyDoc>) {}

  save = async (currency: Currency): Promise<void> => {
    const persistence = CurrencyMapper.toPersistance(currency);

    await this.currencyModel.updateOne(
      { _id: currency._id },
      { $set: persistence },
      { upsert: true },
    );
  };

  deleteCurrency = async (id: string): Promise<void> => {
    await this.currencyModel.deleteOne({ _id: id });
  };
}
