import { UserModel } from '../../../users/model';
import { UserCommandsRepo } from '../../../users/repo/commands';
import { CouponModel } from '../../model';
import { CouponCommandsRepo } from '../../repo/commands';
import { UpdateCouponController } from './updateCouponController';
import { UpdateCouponUseCase } from './updateCouponUseCase';

const couponCommandsRepo = new CouponCommandsRepo(CouponModel);
const userCommandsRepo = new UserCommandsRepo(UserModel);

const updateCouponUseCase = new UpdateCouponUseCase(couponCommandsRepo, userCommandsRepo);

export const updateCouponController = new UpdateCouponController(updateCouponUseCase);
