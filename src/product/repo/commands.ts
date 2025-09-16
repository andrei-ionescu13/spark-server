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
}
