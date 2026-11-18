import { Mongo } from '../../../../mongo';
import { CloudinaryUploaderService } from '../../../../services/uploaderService';
import { CollectionCommandsRepo } from '../../../collection/repo/commands';
import { CouponCommandsRepo } from '../../../coupon/repo/commands';
import { DiscountCommandsRepo } from '../../../discount/repo/commands';
import { KeyCommandsRepo } from '../../../key/repo/commands';
import { KeyQueriesRepo } from '../../../key/repo/queries';
import { ReviewCommandsRepo } from '../../../review/repo/commands';
import { ReviewQueriesRepo } from '../../../review/repo/queries';
import { UserCommandsRepo } from '../../../users/repo/commands';
import { ProductCommandsRepo } from '../../repo/commands';
import { DeleteProductController } from './deleteProductController';
import { DeleteProductUseCase } from './deleteProductUseCase';

const productCommandsRepo = new ProductCommandsRepo();
const reviewCommandsRepo = new ReviewCommandsRepo();
const reviewQueriesRepo = new ReviewQueriesRepo();
const userCommandsRepo = new UserCommandsRepo();
const keyQueriesRepo = new KeyQueriesRepo();
const keyCommandsRepo = new KeyCommandsRepo();
const uploaderService = new CloudinaryUploaderService();
const collectionCommandsRepo = new CollectionCommandsRepo();
const discountCommandsRepo = new DiscountCommandsRepo();
const couponCommandsRepo = new CouponCommandsRepo();

const deleteProductUseCase = new DeleteProductUseCase(
  productCommandsRepo,
  reviewCommandsRepo,
  reviewQueriesRepo,
  userCommandsRepo,
  keyQueriesRepo,
  keyCommandsRepo,
  uploaderService,
  collectionCommandsRepo,
  discountCommandsRepo,
  couponCommandsRepo,
);
export const deleteProductController = new DeleteProductController(deleteProductUseCase);
