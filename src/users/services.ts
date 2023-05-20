import { userDb } from './index';

const getUser = (id) => userDb.getUser(id);

const searchUsers = async (query) => {
  const users = await userDb.searchUsers(query);
  const count = await userDb.getUsersCount(query);
  return { users, count };
};

const updateUser = async () => {};

const createUser = (props) => userDb.createUser(props);

const searchUserReviews = async (id, query) => {
  const reviews = await userDb.searchUserReviews(id, query);
  const count = await userDb.getUserReviewsCount(id, query);

  return { reviews, count };
};

export const userServices = {
  searchUsers,
  updateUser,
  getUser,
  createUser,
  searchUserReviews,
};
