import { Currency } from '../currency';
import { CurrencyMapper } from '../currencyMapper';
import { CurrencyDoc } from '../model';
import { Collection } from 'mongodb';

export interface CurrencyCommandsRepoI {
  save: (language: Currency) => Promise<void>;
  deleteCurrency: (id: string) => Promise<void>;
}

export class CurrencyCommandsRepo implements CurrencyCommandsRepoI {
  constructor(private collection: Collection<CurrencyDoc>) {}

  save = async (currency: Currency): Promise<void> => {
    const persistence = CurrencyMapper.toPersistance(currency);

    await this.collection.updateOne({ _id: currency._id }, { $set: persistence }, { upsert: true });
  };

  deleteCurrency = async (id: string): Promise<void> => {
    await this.collection.deleteOne({ _id: id });
  };
}
