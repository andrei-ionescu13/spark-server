import { discountDb } from './index';
import { ForbiddenError, NotFoundError } from '../errors';
import { productDb } from '../product/index';

const createDiscount = async (props) => {
  const products = await productDb.getProducts(props.products);

  products.forEach((product) => {
    if (!product.discount) return;

    const now = Date.now();
    let { endDate } = product.discount;
    endDate = endDate && new Date(endDate);

    if (!endDate || (endDate && endDate.getTime() > now)) {
      throw new ForbiddenError(`${product.title} has a discount already`);
    }
  });

  const discount = await discountDb.createDiscount(props);
  await discount.products.map((product) => productDb.updateProduct(product, { discount }));

  return discount;
};

const getDiscount = (id) => discountDb.getDiscount(id);

// const searchDiscounts = async (query) => {
//   const discounts = await discountDb.searchDiscounts(query);
//   const count = await discountDb.getDiscountsCount(query);

//   return { discounts, count };
// };

const deleteDiscount = async (id) => {
  const discount = await discountDb.getDiscount(id);

  if (!discount) {
    throw new NotFoundError('discount not found');
  }

  await discountDb.deleteDiscount(id);
  await discount.products.map((product) => productDb.updateProduct(product, { discount: null }));
  return discount;
};

const updateDiscount = async (id, props) => {
  const discount = await discountDb.getDiscount(id);

  if (!discount) {
    throw new NotFoundError('discount not found');
  }

  const products = await productDb.getProducts(props.products);
  products.forEach((product) => {
    if (!product.discount || product.discount?._id.toString() === id) return;

    const now = Date.now();
    let { endDate } = product.discount;
    endDate = endDate && new Date(endDate);

    if (!endDate || (endDate && endDate.getTime() > now)) {
      throw new ForbiddenError(`${product.title} has a discount already`);
    }
  });

  const prevProducts = discount.products.map((x) => x._id.toString());
  const removedProducts = prevProducts.filter((product) => !props.products.includes(product));
  await removedProducts.map((product) => productDb.updateProduct(product, { discount: null }));
  const updatedDiscount = await discountDb.updateDiscount(id, props);
  await updatedDiscount.products.map((product) => productDb.updateProduct(product, { discount }));

  return updatedDiscount;
};

const deactivateDiscount = async (id) => {
  const discount = await discountDb.getDiscount(id);

  if (!discount) {
    throw new NotFoundError('discount not found');
  }

  await discountDb.updateDiscount(id, { endDate: Date.now() });
  return discount;
};

export const discountService = {
  createDiscount,
  getDiscount,
  // searchDiscounts,
  deleteDiscount,
  deactivateDiscount,
  updateDiscount,
};
