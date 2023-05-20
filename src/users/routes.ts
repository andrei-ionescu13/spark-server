import express, { Request, Response } from 'express';
import { getUserController } from './useCases/getUser';
import { searchUserReviewsController } from './useCases/searchUserReviews';
import { searchUsersController } from './useCases/searchUsers';
const router = express.Router();

// router.post('/', userController.createUser);
router.get('/search', (req: Request, res: Response) => searchUsersController.execute(req, res));
router.get('/:userId', (req: Request, res: Response) => getUserController.execute(req, res));
router.get('/:userId/reviews', (req: Request, res: Response) =>
  searchUserReviewsController.execute(req, res),
);

export default router;
