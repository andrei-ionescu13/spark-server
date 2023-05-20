import { CollectionRepo } from '../../../collection/collectionRepo';
import { CollectionModel } from '../../../collection/model';
import { DiscountRepo } from '../../../discount/discountRepo';
import { DiscountModel } from '../../../discount/model';
import { KeyModel } from '../../../key';
import { KeyRepo } from '../../../key/keyRepo';
import { CouponModel } from '../../../coupon/model';
import { CouponRepo } from '../../../coupon/couponRepo';
import { ReviewModel } from '../../../review/model';
import { ReviewRepo } from '../../../review/reviewRepo';
import { CloudinaryUploaderService } from '../../../services/uploaderService';
import { UserModel } from '../../../users/model';
import { UserRepo } from '../../../users/userRepo';
import { ProductModel } from '../../model';
import { ProductRepo } from '../../productRepo';
import { DeleteProductController } from './deleteProductController';
import { DeleteProductUseCase } from './deleteProductUseCase';

const productRepo = new ProductRepo(ProductModel);
const collectionRepo = new CollectionRepo(CollectionModel);
const discountRepo = new DiscountRepo(DiscountModel);
const reviewRepo = new ReviewRepo(ReviewModel);
const userRepo = new UserRepo(UserModel);
const keyRepo = new KeyRepo(KeyModel);
const promoCodeRepo = new CouponRepo(CouponModel);

const uploaderService = new CloudinaryUploaderService();

const deleteProductUseCase = new DeleteProductUseCase(
  productRepo,
  collectionRepo,
  discountRepo,
  reviewRepo,
  userRepo,
  keyRepo,
  promoCodeRepo,
  uploaderService,
);
export const deleteProductController = new DeleteProductController(deleteProductUseCase);
