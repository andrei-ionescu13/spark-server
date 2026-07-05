import { Model } from 'mongoose';
import { ProductDoc } from '../model';
import { ProductDto, ProductMapper } from '../productMapper';

export interface ProductQueriesRepoI {
  getProduct: (id: string) => Promise<ProductDto | null>;
  getProductByDeveloper: (developerId: string) => Promise<ProductDto | null>;
  getProductByGenre: (genreId: string) => Promise<ProductDto | null>;
  getProductByFeature: (featureId: string) => Promise<ProductDto | null>;
  searchProductsByKeys: (keyValue: string) => Promise<ProductDto[]>;
  getProductByProps: (props: Array<Record<string, any>>) => Promise<ProductDto | null>;
}

export class ProductQueriesRepo implements ProductQueriesRepoI {
  constructor(private productModel: Model<ProductDoc>) {}

  getProduct = async (id: string): Promise<ProductDto | null> => {
    const doc = await this.productModel
      .findOne({ _id: id })
      .populate('genres publisher platform discount developers features os')
      .lean();

    if (!doc) return null;
    return ProductMapper.toDto(doc);
  };

  getProductByDeveloper = async (developerId: string): Promise<ProductDto | null> => {
    const doc = await this.productModel
      .findOne({ developers: developerId })
      .populate('genres publisher platform discount developers features os')
      .lean();

    if (!doc) return null;
    return ProductMapper.toDto(doc);
  };

  getProductByGenre = async (genreId: string): Promise<ProductDto | null> => {
    const doc = await this.productModel
      .findOne({ genres: genreId })
      .populate('genres publisher platform discount developers features os')
      .lean();

    if (!doc) return null;
    return ProductMapper.toDto(doc);
  };

  getProductByFeature = async (featureId: string): Promise<ProductDto | null> => {
    const doc = await this.productModel
      .findOne({ features: featureId })
      .populate('genres publisher platform discount developers features os')
      .lean();

    if (!doc) return null;
    return ProductMapper.toDto(doc);
  };

  searchProductsByKeys = async (keyValue: string): Promise<ProductDto[]> => {
    const docs = await this.productModel.aggregate([
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
    ]);

    return ProductMapper.toDtoList(docs);
  };

  getProductByProps = async (props: Array<Record<string, any>>) => {
    const doc = await this.productModel.findOne({ $or: props }).lean();
    if (!doc) return null;

    return ProductMapper.toDto(doc);
  };
}
