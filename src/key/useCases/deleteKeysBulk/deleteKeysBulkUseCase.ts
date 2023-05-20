import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { ProductRepoI } from '../../../product/productRepo';
import { UseCase } from '../../../use-case';
import { KeyRepoI } from '../../keyRepo';
import { keyServices } from '../../services';
import { DeleteKeysBulkRequestDto } from './deleteKeysBulkRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class DeleteKeysBulkUseCase implements UseCase<DeleteKeysBulkRequestDto, Response> {
  constructor(private keyRepo: KeyRepoI, private productRepo: ProductRepoI) {}

  deleteKey = async (keyId) => {
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
  };

  execute = async (request: DeleteKeysBulkRequestDto): Promise<Response> => {
    const { keyIds } = request;

    try {
      await Promise.all(keyIds.map((id) => keyServices.deleteKey(id)));
      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
