import express, { Request, Response } from 'express';
import { deleteReviewController } from './useCases/deleteReview';
import { getReviewController } from './useCases/getReview';
import { searchReviewsController } from './useCases/searchReviews';
import { updateReviewStatusController } from './useCases/updateReviewStatus';
const router = express.Router();

router.get('/', (req: Request, res: Response) => searchReviewsController.execute(req, res));
router.delete('/:reviewId', (req: Request, res: Response) =>
  deleteReviewController.execute(req, res),
);
// router.delete('/', (req: Request, res: Response) => deleteReviewsBulkController.execute(req, res));
router.get('/:reviewId', (req: Request, res: Response) => getReviewController.execute(req, res));
router.put('/:reviewId/status', (req: Request, res: Response) =>
  updateReviewStatusController.execute(req, res),
);

// router.post('/', reviewController.createReview);
export default router;
