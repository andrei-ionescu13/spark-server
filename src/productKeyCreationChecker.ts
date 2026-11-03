import { KeyCommandsRepoI } from './modules/key/repo/commands';
import { KeyQueriesRepoI } from './modules/key/repo/queries';
import { Product } from './modules/product/domain/product';
import { ProductCommandsRepoI } from './modules/product/repo/commands';
import { Result } from './result';

export class KeyForPlatformExists extends Error {
  constructor(platformId: string) {
    super(`Product already has a key with this value for platform ${platformId}`);
  }
}

export class ProductKeyCreationChecker {
  constructor(
    private productCommandsRepo: ProductCommandsRepoI,
    private keyCommandsRepo: KeyCommandsRepoI,
  ) {}

  public async checkCanCreate(product: Product, keyValue: string) {
    const key = await this.keyCommandsRepo.getKeyByValue(keyValue);

    if (key) {
      const productsByKey = await this.productCommandsRepo.listProductsByKeyValues(keyValue);
      let commonPlatform: string = '';

      for (const productByKey of productsByKey) {
        if (productByKey.platform === product.platform) {
          commonPlatform = productByKey.platform;
          break;
        }
      }

      const isSamePlatform = !!commonPlatform;
      if (isSamePlatform) {
        return Result.fail(new KeyForPlatformExists(commonPlatform));
      }

      return Result.ok();
    }

    return Result.ok();
  }
}
