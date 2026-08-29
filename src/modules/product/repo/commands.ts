import { Collection } from 'mongodb';
import { Result } from '../../../Result';
import { DomainValidationError } from '../../blog/article/status';
import { ProductDoc } from '../model';
import { Product } from '../product';
import { ProductMapper } from '../productMapper';

export interface ProductCommandsRepoI {
  getProduct: (id: string) => Promise<Result<Product | null, DomainValidationError>>;
  getProductByKey: (id: string) => Promise<Result<Product | null, DomainValidationError>>;
  save: (product: Product) => Promise<void>;
  getProducts: (ids: string[]) => Promise<Result<Product[], DomainValidationError>>;
  getProductByFeature: (
    featureId: string,
  ) => Promise<Result<Product | null, DomainValidationError>>;
  saveMultiple: (products: Product[]) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  deleteProductsGenre: (genreId: string) => Promise<void>;
  deleteProductKey: (productId: string, keyId: string) => Promise<void>;
  deleteFeature: (featureId: string) => Promise<void>;
  deleteDeveloper: (developerId: string) => Promise<void>;
  addProductKey: (productId: string, keyId: string) => Promise<void>;
  deleteProductsOperatingSystem: (operatingSystemId: string) => Promise<void>;
}

export class ProductCommandsRepo implements ProductCommandsRepoI {
  constructor(private collection: Collection<ProductDoc>) {}

  getProduct = async (id: string): Promise<Result<Product | null, DomainValidationError>> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return Result.ok(null);

    const productOrError = ProductMapper.toDomain(doc);
    if (productOrError.isErr()) {
      return Result.fail(new DomainValidationError(productOrError.error.message));
    }

    const product = productOrError.value;
    return Result.ok(product);
  };

  getProductByKey = async (
    keyId: string,
  ): Promise<Result<Product | null, DomainValidationError>> => {
    const doc = await this.collection.findOne({ keys: keyId });
    if (!doc) return Result.ok(null);

    const productOrError = ProductMapper.toDomain(doc);
    if (productOrError.isErr()) {
      return Result.fail(new DomainValidationError(productOrError.error.message));
    }

    const product = productOrError.value;
    return Result.ok(product);
  };

  save = async (product: Product): Promise<void> => {
    const persistence = ProductMapper.toPersistance(product);
    await this.collection.updateOne({ _id: product._id }, { $set: persistence }, { upsert: true });
  };

  getProducts = async (ids: string[]): Promise<Result<Product[], DomainValidationError>> => {
    const docs = await this.collection.find({ _id: { $in: ids } }).toArray();
    const productsOrErrors = ProductMapper.toDomainList(docs);
    const result = Result.combine(productsOrErrors);

    if (result.isErr()) {
      return Result.fail(new DomainValidationError(result.error.message));
    }

    const products = productsOrErrors.map((productOrError) => productOrError.value);
    return Result.ok(products);
  };

  getProductByFeature = async (
    featureId: string,
  ): Promise<Result<Product | null, DomainValidationError>> => {
    const doc = await this.collection.findOne({ features: featureId });
    if (!doc) return Result.ok(null);

    const productOrError = ProductMapper.toDomain(doc);
    if (productOrError.isErr()) {
      return Result.fail(new DomainValidationError(productOrError.error.message));
    }

    const product = productOrError.value;
    return Result.ok(product);
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
}
