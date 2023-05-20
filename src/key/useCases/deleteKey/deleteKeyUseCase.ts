import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { ProductRepoI } from '../../../product/productRepo';
import { UseCase } from '../../../use-case';
import { KeyRepoI } from '../../keyRepo';
import { DeleteKeyRequestDto } from './deleteKeyRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class DeleteKeyUseCase implements UseCase<DeleteKeyRequestDto, Response> {
  constructor(private keyRepo: KeyRepoI, private productRepo: ProductRepoI) {}

  execute = async (request: DeleteKeyRequestDto): Promise<Response> => {
    const { keyId } = request;

    try {
      const key = await this.keyRepo.getKey(keyId);
      const keyFound = !!key;

      if (!keyFound) {
        return left(new AppError.NotFound('Key not found'));
      }

      const product = await this.productRepo.getProductByKey(keyId);
      const productFound = !!product;

      if (!productFound) {
        return left(new AppError.NotFound('Product not found'));
      }

      await this.keyRepo.deleteKey(keyId);
      await this.productRepo.deleteProductKey(product._id, keyId);

      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
