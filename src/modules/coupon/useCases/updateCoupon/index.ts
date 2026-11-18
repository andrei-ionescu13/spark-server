import { Mongo } from '../../../../mongo';
import { UserCommandsRepo } from '../../../users/repo/commands';
import { CouponCommandsRepo } from '../../repo/commands';
import { UpdateCouponController } from './updateCouponController';
import { UpdateCouponUseCase } from './updateCouponUseCase';

const couponCommandsRepo = new CouponCommandsRepo();
const userCommandsRepo = new UserCommandsRepo();
const updateCouponUseCase = new UpdateCouponUseCase(couponCommandsRepo, userCommandsRepo);
export const updateCouponController = new UpdateCouponController(updateCouponUseCase);
