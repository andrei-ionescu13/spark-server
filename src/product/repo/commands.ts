import { Model } from 'mongoose';
import { Result } from '../../Result';
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
  deleteProduct: (is: string) => Promise<void>;
}

export class ProductCommandsRepo implements ProductCommandsRepoI {
  constructor(private productModel: Model<ProductDoc>) {}

  getProduct = async (id: string): Promise<Result<Product | null, DomainValidationError>> => {
    const doc = await this.productModel.findOne({ _id: id }).lean();
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
    const doc = await this.productModel.findOne({ keys: keyId }).exec();
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
    await this.productModel.updateOne(
      { _id: product._id },
      { $set: persistence },
      { upsert: true },
    );
  };

  getProducts = async (ids: string[]): Promise<Result<Product[], DomainValidationError>> => {
    const docs = await this.productModel.find({ _id: { $in: ids } }).lean();
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
    const doc = await this.productModel.findOne({ features: featureId }).lean();
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
    await this.productModel.bulkWrite(
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
    await this.productModel.deleteOne({ _id: id });
  };
}
