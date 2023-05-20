import { promoCodeDb } from './index';
import { ForbiddenError, NotFoundError } from '../errors';
import { userDb } from '../users/index';

const createCoupon = async (props) => {
  const promoCode = await promoCodeDb.createCoupon(props);
  await promoCode.users?.map((user) => userDb.addCoupon(user, promoCode));

  return promoCode;
};

const getCoupon = async (id) => {
  let promoCode = await promoCodeDb.getCoupon(id);
  return promoCode;
};

const searchCoupons = async (query) => {
  const promoCodes = await promoCodeDb.searchCoupons(query);
  const count = await promoCodeDb.getCouponsCount(query);

  return { promoCodes, count };
};

const deleteCoupon = async (id) => {
  const promoCode = await promoCodeDb.getCoupon(id);

  if (!promoCode) {
    throw new NotFoundError('promo code not found');
  }

  await promoCodeDb.deleteCoupon(id);
  await promoCode.users?.map((user) => userDb.deleteCoupon(user._id, promoCode._id));
  return promoCode;
};

const updateCoupon = async (id, props) => {
  const promoCode = await promoCodeDb.getCoupon(id);

  if (!promoCode) {
    throw new NotFoundError('promo code not found');
  }

  if (!!promoCode.users?.length) {
    if (props.userSelection === 'selected') {
      const prevUsers = promoCode.users.map((x) => x._id.toString());
      const removedUsers = prevUsers.filter((user) => !props.users.includes(user));
      await removedUsers.map((user) => userDb.deleteCoupon(user, promoCode._id));
    } else {
      const prevUsers = promoCode.users.map((x) => x._id.toString());
      await prevUsers.map((user) => userDb.deleteCoupon(user, promoCode._id));
    }
  }

  const updatedCoupon = await promoCodeDb.updateCoupon(id, props);
  await updatedCoupon.users?.map((user) => userDb.addCoupon(user, promoCode));

  return updatedCoupon;
};

const deactivateCoupon = async (id) => {
  const promoCode = await promoCodeDb.getCoupon(id);

  if (!promoCode) {
    throw new NotFoundError('promo code not found');
  }

  await promoCodeDb.updateCoupon(id, { endDate: Date.now() });
  return promoCode;
};

export const promoCodeService = {
  createCoupon,
  getCoupon,
  searchCoupons,
  deleteCoupon,
  deactivateCoupon,
  updateCoupon,
};
