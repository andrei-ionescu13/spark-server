import { Model } from 'mongoose';
import { Currency } from './model';

export interface CurrencyRepoI {
  getCurrency: any;
  listCurrencies: any;
  createCurrency: any;
  deleteCurrency: any;
  searchCurrencies: any;
  getCurrenciesCount: any;
  getCurrencyByCode: any;
}

export class CurrencyRepo implements CurrencyRepoI {
  constructor(private currencyModel: Model<Currency>) {}

  getCurrency = (id) => this.currencyModel.findOne({ _id: id }).exec();

  getCurrencyByCode = (code) => this.currencyModel.findOne({ code }).exec();

  listCurrencies = () => this.currencyModel.find({});

  createCurrency = (props) => this.currencyModel.create(props);

  deleteCurrency = (id) => this.currencyModel.deleteOne({ _id: id });

  searchCurrencies = (query) => {
    const { keyword = '', sortBy = 'createdAt', sortOrder = 'asc', page = 1, limit = 10 } = query;

    return this.currencyModel
      .find({
        $or: [
          {
            name: {
              $regex: keyword,
              $options: 'i',
            },
          },
          {
            code: {
              $regex: keyword,
              $options: 'i',
            },
          },
          {
            symbol: {
              $regex: keyword,
              $options: 'i',
            },
          },
        ],
      })
      .sort({
        [sortBy]: sortOrder,
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  };

  getCurrenciesCount = (query) => {
    const { keyword = '' } = query;

    return this.currencyModel
      .find({
        $or: [
          {
            name: {
              $regex: keyword,
              $options: 'i',
            },
          },
          {
            code: {
              $regex: keyword,
              $options: 'i',
            },
          },
          {
            symbol: {
              $regex: keyword,
              $options: 'i',
            },
          },
        ],
      })
      .count();
  };
}
