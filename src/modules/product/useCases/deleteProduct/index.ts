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

const productCommandsRepo = new ProductCommandsRepo(Mongo.getCollection('products'));
const reviewCommandsRepo = new ReviewCommandsRepo(Mongo.getCollection('reviews'));
const reviewQueriesRepo = new ReviewQueriesRepo(Mongo.getCollection('reviews'));
const userCommandsRepo = new UserCommandsRepo(Mongo.getCollection('users'));
const keyQueriesRepo = new KeyQueriesRepo(Mongo.getCollection('keys'));
const keyCommandsRepo = new KeyCommandsRepo(Mongo.getCollection('keys'));
const uploaderService = new CloudinaryUploaderService();
const collectionCommandsRepo = new CollectionCommandsRepo(Mongo.getCollection('collections'));
const discountCommandsRepo = new DiscountCommandsRepo(Mongo.getCollection('discounts'));
const couponCommandsRepo = new CouponCommandsRepo(Mongo.getCollection('coupons'));

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
