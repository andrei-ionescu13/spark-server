import { UserModel } from '../../../users/model';
import { UserCommandsRepo } from '../../../users/repo/commands';
import { CouponModel } from '../../model';
import { CouponCommandsRepo } from '../../repo/commands';
import { CreateCouponController } from './createCouponController';
import { CreateCouponUseCase } from './createCouponUseCase';

const couponCommandsRepo = new CouponCommandsRepo(CouponModel);
const userCommandsRepo = new UserCommandsRepo(UserModel);

const createCouponUseCase = new CreateCouponUseCase(couponCommandsRepo, userCommandsRepo);

export const createCouponController = new CreateCouponController(createCouponUseCase);
