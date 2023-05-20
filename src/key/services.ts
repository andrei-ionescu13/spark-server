import { keyDb } from './index';
import { productDb } from '../product/index';
import { ForbiddenError, NotFoundError } from '../errors';

const createKey = async (productId, keyValue) => {
  const product = await productDb.getProduct(productId);

  if (!product) {
    throw new NotFoundError('product not found');
  }

  const key = await keyDb.createKey({
    product: productId,
    value: keyValue,
  });

  await productDb.addProductKey(productId, key);
  return key;
};

const importKeys = async (file) => {
  const keysItems = JSON.parse(file.buffer.toString());

  await Promise.all(
    keysItems.map((item) => item.keys.map((key) => createKey(item.productId, key))),
  );
};

const deleteKey = async (id) => {
  const key = await keyDb.getKey(id);

  if (!key) {
    throw new NotFoundError('key not found');
  }

  const product = await productDb.getProductByKey(id);

  if (!product) {
    throw new NotFoundError('product not found');
  }

  await keyDb.deleteKey(id);
  await productDb.deleteProductKey(product._id, id);
};

const searchKeys = async (query) => {
  const keys = await keyDb.searchKeys(query);
  const count = await keyDb.getKeysCount(query);

  return {
    keys,
    count,
  };
};

const updateKey = async (id, props) => {
  const key = await keyDb.getKey(id);

  if (!key) {
    throw new NotFoundError('key not found');
  }

  if (key.status === 'secret') {
    throw new ForbiddenError(`can't modify a secret key`);
  }

  const updatedKey = await keyDb.updateKey(id, props);
  return updatedKey;
};

export const keyServices = {
  createKey,
  importKeys,
  deleteKey,
  searchKeys,
  updateKey,
};
