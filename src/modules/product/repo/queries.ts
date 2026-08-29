import { Collection } from 'mongodb';
import { ProductDoc } from '../model';
import { ProductDto, ProductMapper } from '../productMapper';
import { ReviewDto, ReviewMapper } from '../../review/reviewMapper';
import { KeyDto } from '../../key/keyMapper';

export interface ProductQueriesRepoI {
  getProduct: (id: string) => Promise<ProductDto | null>;
  getProductByDeveloper: (developerId: string) => Promise<ProductDto | null>;
  getProductByGenre: (genreId: string) => Promise<ProductDto | null>;
  getProductByFeature: (featureId: string) => Promise<ProductDto | null>;
  searchProductsByKeys: (keyValue: string) => Promise<ProductDto[]>;
  getProductByProps: (props: Array<Record<string, any>>) => Promise<ProductDto | null>;
  searchProductReviews: (id: string, query) => Promise<{ reviews: ReviewDto[]; count: number }>;
  searchProducts: (query) => Promise<{ products: ProductDto[]; count: number }>;
  searchProductKeys: (id: string, query) => Promise<{ keys: KeyDto[]; count: number }>;
}

export class ProductQueriesRepo implements ProductQueriesRepoI {
  constructor(private collection: Collection<ProductDoc>) {}

  getProduct = async (id: string): Promise<ProductDto | null> => {
    const pipeline = [
      {
        $match: { _id: id },
      },
      {
        $lookup: {
          from: 'genres',
          localField: 'genres',
          foreignField: '_id',
          as: 'genres',
        },
      },
      {
        $lookup: {
          from: 'developers',
          localField: 'developers',
          foreignField: '_id',
          as: 'developers',
        },
      },
      {
        $lookup: {
          from: 'features',
          localField: 'features',
          foreignField: '_id',
          as: 'features',
        },
      },
      {
        $lookup: {
          from: 'operating_systems',
          localField: 'os',
          foreignField: '_id',
          as: 'os',
        },
      },
      { $unwind: '$os' },

      {
        $lookup: {
          from: 'publisher',
          localField: 'publisher',
          foreignField: '_id',
          as: 'publisher',
        },
      },
      { $unwind: '$publisher' },
      {
        $lookup: {
          from: 'platform',
          localField: 'platform',
          foreignField: '_id',
          as: 'platform',
        },
      },
      { $unwind: '$platform' },
      {
        $lookup: {
          from: 'discount',
          localField: 'discount',
          foreignField: '_id',
          as: 'discount',
        },
      },
      { $unwind: '$discount' },
    ];
    const doc = await this.collection.aggregate(pipeline).next();

    if (!doc) return null;
    return ProductMapper.toDto(doc);
  };

  getProductByDeveloper = async (developerId: string): Promise<ProductDto | null> => {
    const pipeline = [
      {
        $match: { developers: developerId },
      },
      {
        $lookup: {
          from: 'genres',
          localField: 'genres',
          foreignField: '_id',
          as: 'genres',
        },
      },
      {
        $lookup: {
          from: 'developers',
          localField: 'developers',
          foreignField: '_id',
          as: 'developers',
        },
      },
      {
        $lookup: {
          from: 'features',
          localField: 'features',
          foreignField: '_id',
          as: 'features',
        },
      },
      {
        $lookup: {
          from: 'operating_systems',
          localField: 'os',
          foreignField: '_id',
          as: 'os',
        },
      },
      { $unwind: '$os' },

      {
        $lookup: {
          from: 'publisher',
          localField: 'publisher',
          foreignField: '_id',
          as: 'publisher',
        },
      },
      { $unwind: '$publisher' },
      {
        $lookup: {
          from: 'platform',
          localField: 'platform',
          foreignField: '_id',
          as: 'platform',
        },
      },
      { $unwind: '$platform' },
      {
        $lookup: {
          from: 'discount',
          localField: 'discount',
          foreignField: '_id',
          as: 'discount',
        },
      },
      { $unwind: '$discount' },
    ];
    const doc = await this.collection.aggregate(pipeline).next();

    if (!doc) return null;
    return ProductMapper.toDto(doc);
  };

  getProductByGenre = async (genreId: string): Promise<ProductDto | null> => {
    const pipeline = [
      {
        $match: { genres: genreId },
      },
      {
        $lookup: {
          from: 'genres',
          localField: 'genres',
          foreignField: '_id',
          as: 'genres',
        },
      },
      {
        $lookup: {
          from: 'developers',
          localField: 'developers',
          foreignField: '_id',
          as: 'developers',
        },
      },
      {
        $lookup: {
          from: 'features',
          localField: 'features',
          foreignField: '_id',
          as: 'features',
        },
      },
      {
        $lookup: {
          from: 'operating_systems',
          localField: 'os',
          foreignField: '_id',
          as: 'os',
        },
      },
      { $unwind: '$os' },

      {
        $lookup: {
          from: 'publisher',
          localField: 'publisher',
          foreignField: '_id',
          as: 'publisher',
        },
      },
      { $unwind: '$publisher' },
      {
        $lookup: {
          from: 'platform',
          localField: 'platform',
          foreignField: '_id',
          as: 'platform',
        },
      },
      { $unwind: '$platform' },
      {
        $lookup: {
          from: 'discount',
          localField: 'discount',
          foreignField: '_id',
          as: 'discount',
        },
      },
      { $unwind: '$discount' },
    ];
    const doc = await this.collection.aggregate(pipeline).next();

    if (!doc) return null;
    return ProductMapper.toDto(doc);
  };

  getProductByFeature = async (featureId: string): Promise<ProductDto | null> => {
    const pipeline = [
      {
        $match: { features: featureId },
      },
      {
        $lookup: {
          from: 'genres',
          localField: 'genres',
          foreignField: '_id',
          as: 'genres',
        },
      },
      {
        $lookup: {
          from: 'developers',
          localField: 'developers',
          foreignField: '_id',
          as: 'developers',
        },
      },
      {
        $lookup: {
          from: 'features',
          localField: 'features',
          foreignField: '_id',
          as: 'features',
        },
      },
      {
        $lookup: {
          from: 'operating_systems',
          localField: 'os',
          foreignField: '_id',
          as: 'os',
        },
      },
      { $unwind: '$os' },

      {
        $lookup: {
          from: 'publisher',
          localField: 'publisher',
          foreignField: '_id',
          as: 'publisher',
        },
      },
      { $unwind: '$publisher' },
      {
        $lookup: {
          from: 'platform',
          localField: 'platform',
          foreignField: '_id',
          as: 'platform',
        },
      },
      { $unwind: '$platform' },
      {
        $lookup: {
          from: 'discount',
          localField: 'discount',
          foreignField: '_id',
          as: 'discount',
        },
      },
      { $unwind: '$discount' },
    ];
    const doc = await this.collection.aggregate(pipeline).next();

    if (!doc) return null;
    return ProductMapper.toDto(doc);
  };

  searchProductsByKeys = async (keyValue: string): Promise<ProductDto[]> => {
    const docs = await this.collection
      .aggregate([
        {
          $unwind: '$keys',
        },
        {
          $lookup: {
            from: 'keys',
            localField: 'keys',
            foreignField: '_id',
            as: 'keys',
          },
        },
        {
          $match: {
            'keys.value': keyValue,
          },
        },
        {
          $lookup: {
            from: 'platforms',
            localField: 'platform',
            foreignField: '_id',
            as: 'platform',
          },
        },
        {
          $addFields: {
            platform: {
              $arrayElemAt: ['$platform', 0],
            },
          },
        },
      ])
      .toArray();

    return ProductMapper.toDtoList(docs);
  };

  getProductByProps = async (props: Array<Record<string, any>>) => {
    const doc = await this.collection.findOne({ $or: props });
    if (!doc) return null;

    return ProductMapper.toDto(doc);
  };

  searchProductReviews = async (
    id: string,
    query,
  ): Promise<{ reviews: ReviewDto[]; count: number }> => {
    const { keyword = '', status, sortOrder = 'desc', page = 1, limit = 10 } = query;
    let { sortBy = 'createdAt' } = query;

    if (sortBy === 'user') {
      sortBy = 'user.email';
    }

    const [result] = await this.collection
      .aggregate([
        {
          $match: {
            _id: id,
          },
        },
        {
          $project: {
            _id: 0,
            reviews: '$reviews',
          },
        },
        {
          $lookup: {
            from: 'reviews',
            localField: 'reviews',
            foreignField: '_id',
            as: 'reviews',
          },
        },
        { $unwind: '$reviews' },
        { $replaceRoot: { newRoot: '$reviews' } },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $set: {
            user: { $arrayElemAt: ['$user', 0] },
          },
        },
        {
          $match: {
            $and: [
              {
                $or: [
                  {
                    'user.email': {
                      $regex: keyword,
                      $options: 'i',
                    },
                  },
                ],
              },
              {
                ...(status && {
                  status,
                }),
              },
            ],
          },
        },
        { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
        {
          $facet: {
            count: [{ $count: 'count' }],
            reviews: [{ $skip: (page - 1) * limit }, { $limit: limit }],
          },
        },
        {
          $project: {
            reviews: 1,
            count: {
              $ifNull: [{ $arrayElemAt: ['$count.count', 0] }, 0],
            },
          },
        },
      ])
      .toArray();

    return {
      count: result.count,
      reviews: ReviewMapper.toDtoList(result.reviews),
    };
  };

  searchProducts = async (query): Promise<{ products: ProductDto[]; count: number }> => {
    const {
      keyword = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status,
      page = 1,
      limit = 10,
    } = query;
    const pipeline = [
      {
        $match: {
          title: {
            $regex: keyword,
            $options: 'i',
          },
          ...(status && {
            status,
          }),
        },
      },
      { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
      {
        $facet: {
          count: [{ $count: 'count' }],
          products: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        },
      },
      {
        $project: {
          products: 1,
          count: {
            $ifNull: [{ $arrayElemAt: ['$count.count', 0] }, 0],
          },
        },
      },
    ];
    const [result] = await this.collection.aggregate(pipeline).toArray();

    return {
      count: result.count,
      products: ProductMapper.toDtoList(result.products),
    };
  };

  searchProductKeys = async (id: string, query) => {
    let { keyword = '', status, page = 1, limit = 10 } = query;

    const [result] = await this.collection
      .aggregate([
        { $match: { _id: id } },
        {
          $lookup: {
            from: 'keys',
            localField: '_id',
            foreignField: 'product',
            as: 'keys',
          },
        },
        { $unwind: '$keys' },
        {
          $match: {
            'keys.value': {
              $regex: keyword,
              $options: 'i',
            },
            ...(status && {
              'keys.status': status,
            }),
          },
        },
        {
          $sort: {
            'keys.createdAt': 1,
          },
        },
        {
          $facet: {
            count: [{ $count: 'count' }],
            keys: [
              { $skip: (page - 1) * limit },
              { $limit: limit },
              {
                $group: {
                  _id: '$_id',
                  keys: {
                    $push: '$keys',
                  },
                },
              },
            ],
          },
        },
        {
          $addFields: {
            count: {
              $arrayElemAt: ['$count', 0],
            },
            keys: {
              $arrayElemAt: ['$keys', 0],
            },
          },
        },
        {
          $project: {
            count: '$count.count',
            keys: '$keys.keys',
          },
        },
      ])
      .toArray();

    return {
      count: result.count,
      keys: result.keys,
    };
  };
}
