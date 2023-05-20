import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { NotFoundError } from '../../../errors';
import { ProductRepoI } from '../../../product/productRepo';
import { UseCase } from '../../../use-case';
import { KeyRepoI } from '../../keyRepo';
import { CreateKeyRequestDto } from './createKeyRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class CreateKeyUseCase implements UseCase<CreateKeyRequestDto, Response> {
  constructor(private keyRepo: KeyRepoI, private productRepo: ProductRepoI) {}

  execute = async (request: CreateKeyRequestDto): Promise<Response> => {
    const { productId, value } = request;

    try {
      const product = await this.productRepo.getProduct(productId);

      if (!product) {
        return left(new AppError.NotFound('Product not found'));
      }

      const key = await this.keyRepo.createKey({
        product: productId,
        value,
      });

      await this.productRepo.addProductKey(productId, key);

      return right(Result.ok<any>(key._id));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
