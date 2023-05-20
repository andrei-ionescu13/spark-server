import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { ProductRepoI } from '../../../product/productRepo';
import { UseCase } from '../../../use-case';
import { KeyRepoI } from '../../keyRepo';
import { ImportKeysRequestDto } from './importKeysRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class ImportKeysUseCase implements UseCase<ImportKeysRequestDto, Response> {
  constructor(private keyRepo: KeyRepoI, private productRepo: ProductRepoI) {}

  createKey = async (productId, value) => {
    const product = await this.productRepo.getProduct(productId);

    if (!product) {
      return left(new AppError.NotFound('Product not found'));
    }

    const key = await this.keyRepo.createKey({
      product: productId,
      value,
    });
  };

  execute = async (request: ImportKeysRequestDto): Promise<Response> => {
    const { keysFile } = request;
    const keysItems = JSON.parse(keysFile.buffer.toString());

    try {
      await Promise.all(
        keysItems.map((item) => item.keys.map((key) => this.createKey(item.productId, key))),
      );

      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
