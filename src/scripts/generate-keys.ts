import { v4 as uuidv4 } from 'uuid';
import { ProductQueriesRepo } from '../modules/product/repo/queries';
import { ProductCommandsRepo } from '../modules/product/repo/commands';
import { Mongo } from '../mongo';
import { KeyCommandsRepo } from '../modules/key/repo/commands';
import { Key } from '../modules/key/domain/key';
import { KeyAvailability } from '../modules/key/domain/keyAvailability';
import { KeyStatus } from '../modules/key/domain/keyStatus';
import { KeyValue } from '../modules/key/domain/keyValue';

export const generateKeys = async () => {
  const productRepo = new ProductCommandsRepo(Mongo.getCollection('products'));
  const keyRepo = new KeyCommandsRepo(Mongo.getCollection('keys'));
  const products = await productRepo.listAll();

  for (const product of products) {
    const availability = KeyAvailability.create('available').value;
    const status = KeyStatus.create('secret').value;
    product.keys = [];

    for (const element of Array.from({ length: 50 })) {
      const value = KeyValue.create(uuidv4()).value;
      const key = Key.create({
        availability,
        status,
        product: product._id,
        value,
      }).value;
      console.log(key);

      product.addKey(key._id);
      await keyRepo.save(key);
      console.log(product.keys);
    }

    await productRepo.save(product);
  }
};
