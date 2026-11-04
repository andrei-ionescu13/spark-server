import { UseCaseErrors } from '../../../../appErrors';
import { Result } from '../../../../results';
import { UseCase } from '../../../../useCase';
import { Discount } from '../../domain/discount';
import { DiscountCommandsRepoI } from '../../repo/commands';
import { DeactivateDiscountRequestDto } from './deactivateDiscountRequestDto';

type Response = Result<Discount, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class DeactivateDiscountUseCase implements UseCase<DeactivateDiscountRequestDto, Response> {
  constructor(private discountCommandsRepo: DiscountCommandsRepoI) {}

  execute = async (request: DeactivateDiscountRequestDto): Promise<Response> => {
    const { discountId } = request;

    try {
      const discount = await this.discountCommandsRepo.getDiscount(discountId);
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
