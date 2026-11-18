import { Mongo } from '../../../../mongo';
import { UserCommandsRepo } from '../../../users/repo/commands';
import { CouponCommandsRepo } from '../../repo/commands';
import { CreateCouponController } from './createCouponController';
import { CreateCouponUseCase } from './createCouponUseCase';

const couponCommandsRepo = new CouponCommandsRepo();
const userCommandsRepo = new UserCommandsRepo();
const createCouponUseCase = new CreateCouponUseCase(couponCommandsRepo, userCommandsRepo);
export const createCouponController = new CreateCouponController(createCouponUseCase);
