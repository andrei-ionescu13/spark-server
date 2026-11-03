import { Collection } from 'mongodb';
import { DomainValidationError } from '../../blog/article/domain/status';
import { ProductDoc } from '../model';
import { Product } from '../domain/product';
import { ProductMapper } from '../productMapper';

export interface ProductCommandsRepoI {
  getProduct: (id: string) => Promise<Product | null>;
  getProductByKey: (id: string) => Promise<Product | null>;
  save: (product: Product) => Promise<void>;
  getProducts: (ids: string[]) => Promise<Product[]>;
  getProductByFeature: (featureId: string) => Promise<Product | null>;
  saveMultiple: (products: Product[]) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  deleteProductsGenre: (genreId: string) => Promise<void>;
  deleteProductKey: (productId: string, keyId: string) => Promise<void>;
  deleteFeature: (featureId: string) => Promise<void>;
  deleteDeveloper: (developerId: string) => Promise<void>;
  addProductKey: (productId: string, keyId: string) => Promise<void>;
  deleteProductsOperatingSystem: (operatingSystemId: string) => Promise<void>;
  listProductsByKeyValues: (keyValue: string) => Promise<Product[]>;
  listAll: () => Promise<Product[]>;
}

export class ProductCommandsRepo implements ProductCommandsRepoI {
  constructor(private collection: Collection<ProductDoc>) {}

  listAll = async () => {
    const docs = await this.collection.find({}).toArray();
    return ProductMapper.toDomainList(docs);
  };

  getProduct = async (id: string): Promise<Product | null> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return null;

    const product = ProductMapper.toDomain(doc);
    return product;
  };

  getProductByKey = async (keyId: string): Promise<Product | null> => {
    const doc = await this.collection.findOne({ keys: keyId });
    if (!doc) return null;

    const product = ProductMapper.toDomain(doc);
    return product;
  };

  save = async (product: Product): Promise<void> => {
    const persistence = ProductMapper.toPersistance(product);
    await this.collection.updateOne({ _id: product._id }, { $set: persistence }, { upsert: true });
  };

  getProducts = async (ids: string[]): Promise<Product[]> => {
    const docs = await this.collection.find({ _id: { $in: ids } }).toArray();
    const products = ProductMapper.toDomainList(docs);

    return products;
  };

  getProductByFeature = async (featureId: string): Promise<Product | null> => {
    const doc = await this.collection.findOne({ features: featureId });
    if (!doc) return null;

    const product = ProductMapper.toDomain(doc);
    return product;
  };

  saveMultiple = async (products: Product[]): Promise<void> => {
    const persistenceList = ProductMapper.toPersistanceList(products);
    await this.collection.bulkWrite(
      persistenceList.map((p) => ({
        updateOne: {
          filter: { _id: p._id },
          update: { $set: p },
          upsert: true,
        },
      })),
    );
  };

  deleteProduct = async (id: string): Promise<void> => {
    await this.collection.deleteOne({ _id: id });
  };

  deleteProductsGenre = async (genreId: string) => {
    await this.collection.updateMany({ genres: genreId }, { $pull: { genres: genreId } });
  };

  deleteProductKey = async (productId: string, keyId: string) => {
    await this.collection.updateOne(
      { _id: productId },
      {
        $pull: {
          keys: keyId,
        },
      },
    );
  };

  deleteDeveloper = async (developerId: string) => {
    await this.collection.updateMany(
      { developers: developerId },
      { $pull: { developers: developerId } },
    );
  };

  deleteFeature = async (featureId: string) => {
    await this.collection.updateMany({ features: featureId }, { $pull: { features: featureId } });
  };

  deleteProductsOperatingSystem = async (operatingSystemId: string) => {
    await this.collection.updateMany(
      { operatingSystems: operatingSystemId },
      { $pull: { operatingSystems: operatingSystemId } },
    );
  };

  addProductKey = async (productId: string, keyId: string) => {
    await this.collection.updateOne(
      { _id: productId },
      {
        $push: {
          keys: keyId,
        },
      },
    );
  };

  listProductsByKeyValues = async (keyValue: string): Promise<Product[]> => {
    const pipeline = [
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
    ];
    const docs = await this.collection.aggregate<ProductDoc>(pipeline).toArray();

    return ProductMapper.toDomainList(docs);
  };
}
