import { v4 as uuidv4 } from 'uuid';
import { KeyRepo } from '../src/key/keyRepo';
import { KeyModel } from '../src/key/model';
import { ProductModel } from '../src/product/model';
import { ProductRepo } from '../src/product/productRepo';

export const generateKeys = async () => {
  const productRepo = new ProductRepo(ProductModel);
  const keyRepo = new KeyRepo(KeyModel);
  const products = await productRepo.listProducts();

  for (let index = 0; index < products.length; index++) {
    const product = products[index];
    Array.from(Array(100).keys()).map(async (i) => {
      const keyCreated = await keyRepo.createKey({
        product: product._id,
        value: uuidv4(),
      });
      console.log(product._id, keyCreated);
      await productRepo.addProductKey(product._id, keyCreated);
    });
  }
};
