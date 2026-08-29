import { Collection } from 'mongodb';
import { CurrencyDto, CurrencyMapper } from '../currencyMapper';
import { CurrencyDoc } from '../model';

type SearchCurrenciesQueries = {
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit: number;
};

type SearchCurrenciesResponse = {
  currencies: CurrencyDto[];
  count: number;
};

export interface CurrencyQueriesRepoI {
  getCurrencyByCode: (code: string) => Promise<CurrencyDto | null>;
  getCurrency: (id: string) => Promise<CurrencyDto | null>;
  searchCurrencies: (query: SearchCurrenciesQueries) => Promise<SearchCurrenciesResponse>;
}

export class CurrencyQueriesRepo implements CurrencyQueriesRepoI {
  constructor(private collection: Collection<CurrencyDoc>) {}

  getCurrencyByCode = async (code: string): Promise<CurrencyDto | null> => {
    const doc = await this.collection.findOne({ code });
    if (!doc) return null;

    return CurrencyMapper.toDto(doc);
  };

  getCurrency = async (id: string): Promise<CurrencyDto | null> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return null;

    return CurrencyMapper.toDto(doc);
  };

  searchCurrencies = async (query: SearchCurrenciesQueries): Promise<SearchCurrenciesResponse> => {
    const { keyword = '', sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = query;
    const pipeline = [
      {
        $match: {
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
        },
      },
      { $sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 } },
      {
        $facet: {
          currencies: [{ $skip: page }, { $limit: limit }],
          count: [
            {
              $count: 'count',
            },
          ],
        },
      },
      {
        $project: {
          currencies: 1,
          count: {
            $ifNull: [{ $arrayElemAt: ['$count.count', 0] }, 0],
          },
        },
      },
    ];
    const [result] = await this.collection.aggregate(pipeline).toArray();

    return {
      currencies: CurrencyMapper.toDtoList(result.currencies),
      count: result.count,
    };
  };
}
