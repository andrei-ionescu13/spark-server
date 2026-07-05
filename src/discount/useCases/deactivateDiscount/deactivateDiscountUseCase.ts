import { UseCaseErrors } from '../../../AppError';
import { Result } from '../../../Result';
import { UseCase } from '../../../use-case';
import { Discount } from '../../discount';
import { DiscountCommandsRepoI } from '../../repo/commands';
import { DeactivateDiscountRequestDto } from './deactivateDiscountRequestDto';

type Response = Result<Discount, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class DeactivateDiscountUseCase implements UseCase<DeactivateDiscountRequestDto, Response> {
  constructor(private discountCommandsRepo: DiscountCommandsRepoI) {}

  execute = async (request: DeactivateDiscountRequestDto): Promise<Response> => {
    const { discountId } = request;

    try {
      const discountOrError = await this.discountCommandsRepo.getDiscount(discountId);
      if (discountOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(discountOrError.error.message));
      }

      const discount = discountOrError.value;
      if (!discount) {
        return Result.fail(new UseCaseErrors.NotFound('Discount not found'));
      }

      discount.deactivate();
      await this.discountCommandsRepo.save(discount);

      return Result.ok(discount);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
