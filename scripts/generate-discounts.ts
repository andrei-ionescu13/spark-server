import { ProductCommandsRepo } from '../src/modules/product/repo/commands';
import { DiscountCommandsRepo } from '../src/modules/discount/repo/commands';
import { DiscountApplicableChecker } from '../src/modules/discount/discountApplicableChecker';
import { Discount, DiscountCreateProps } from '../src/modules/discount/domain/discount';
import { DiscountType } from '../src/modules/discount/domain/discountType';
import { DiscountValue } from '../src/modules/discount/domain/discountValue';
import { DiscountTitle } from '../src/modules/discount/domain/discountTitle';

export const generateDiscounts = async () => {
  const productCommandsRepo = new ProductCommandsRepo();
  const discountCommandsRepo = new DiscountCommandsRepo();
  const products = await productCommandsRepo.listAll();
  const discountType = DiscountType.create('percentage').value;

  for (const product of products) {
    const value = DiscountValue.create(Math.floor(Math.random() * 100) + 1).value;
    if (product.discount) {
      const existingDiscount = await discountCommandsRepo.getDiscount(product.discount);
      if (!existingDiscount) {
        return;
      }

      const isApplicable = DiscountApplicableChecker.check(product, existingDiscount, {
        type: 'percentage',
        value: value.value,
      });
      if (isApplicable.isErr()) {
        return;
      }
    }
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 5);
    const title = DiscountTitle.create(product.title.value).value;
    const props: DiscountCreateProps = {
      endDate: endDate,
      product: product._id,
      startDate: new Date(),
      title,
      type: discountType,
      value,
    };

    const discountOrError = Discount.create(props);
    if (discountOrError.isErr()) {
      return;
    }

    const discount = discountOrError.value;
    const addDiscountResult = product.addDiscount(discount._id);
    if (addDiscountResult.isErr()) {
      return;
    }

    await discountCommandsRepo.save(discount);
    await productCommandsRepo.save(product);
  }
};
