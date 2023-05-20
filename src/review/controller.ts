import { reviewDb } from './index';
import { reviewServices } from './index';
import { productServices } from '../product/index';
import { userServices } from '../users/index';

export const reviewController = {
  createReview: async (req, res, next) => {
    const params = req.body;
    const review = await reviewServices.createReview(params);
    await productServices.addReview(review.product, review);
    await userServices.addReview(review.user, review);

    res.status(201).json({ review });
  },

  deleteReview: async (req, res, next) => {
    const { id } = req.params;
    const review = await reviewServices.deleteReview(id);

    res.json({ review });
  },

  deleteMultipleReviews: async (req, res, next) => {
    try {
      const { ids } = req.body;
      await Promise.all(ids.map((id) => reviewServices.deleteReview(id)));

      res.status(200).json({ ok: 'ok' });
    } catch (error) {
      next(error);
    }
  },

  getReview: async (req, res) => {
    const { id } = req.params;
    const review = await reviewDb.getReview(id);
    res.json(review);
  },

  searchReviews: async (req, res, next) => {
    try {
      const result = await reviewServices.searchReviews(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  updateReviewStatus: async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const updated = await reviewServices.updateReviewStatus(id, status);
      res.json(updated.status);
    } catch (error) {
      next(error);
    }
  },
};
