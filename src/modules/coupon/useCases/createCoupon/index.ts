import { Mongo } from '../../../../mongo';
import { UserModel } from '../../../users/model';
import { UserCommandsRepo } from '../../../users/repo/commands';
import { CouponCommandsRepo } from '../../repo/commands';
import { CreateCouponController } from './createCouponController';
import { CreateCouponUseCase } from './createCouponUseCase';

const couponCommandsRepo = new CouponCommandsRepo(Mongo.getCollection('coupons'));
const userCommandsRepo = new UserCommandsRepo(Mongo.getCollection('users'));

const createCouponUseCase = new CreateCouponUseCase(couponCommandsRepo, userCommandsRepo);

export const createCouponController = new CreateCouponController(createCouponUseCase);
