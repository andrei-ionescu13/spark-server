import { v4 as uuidv4 } from 'uuid';
import { ProductQueriesRepo } from '../src/modules/product/repo/queries';
import { ProductCommandsRepo } from '../src/modules/product/repo/commands';
import { Mongo } from '../src/mongo';
import { KeyCommandsRepo } from '../src/modules/key/repo/commands';
import { Key } from '../src/modules/key/domain/key';
import { KeyAvailability } from '../src/modules/key/domain/keyAvailability';
import { KeyStatus } from '../src/modules/key/domain/keyStatus';
import { KeyValue } from '../src/modules/key/domain/keyValue';

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
