import { Mongo } from '../../../../mongo';
import { UserModel } from '../../../users/model';
import { UserCommandsRepo } from '../../../users/repo/commands';
import { CouponCommandsRepo } from '../../repo/commands';
import { UpdateCouponController } from './updateCouponController';
import { UpdateCouponUseCase } from './updateCouponUseCase';

const couponCommandsRepo = new CouponCommandsRepo(Mongo.getCollection('coupons'));
const userCommandsRepo = new UserCommandsRepo(Mongo.getCollection('users'));

const updateCouponUseCase = new UpdateCouponUseCase(couponCommandsRepo, userCommandsRepo);

export const updateCouponController = new UpdateCouponController(updateCouponUseCase);
