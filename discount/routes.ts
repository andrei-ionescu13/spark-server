import express from 'express';
import type { Request, Response } from 'express';
import { createDiscountController } from './useCases/createDiscount';
import { deactivateDiscountController } from './useCases/deactivateDiscount';
import { deleteDiscountController } from './useCases/deleteDiscount';
import { getDiscountController } from './useCases/getDiscount';
import { searchDiscountsController } from './useCases/searchDiscounts';
import { updateDiscountController } from './useCases/updateDiscount';
import { deleteDiscountsBulkController } from './useCases/deleteDiscountsBulk';
const router = express.Router();

router.get('/search', (req: Request, res: Response) => searchDiscountsController.execute(req, res));
router.get('/:discountId', (req: Request, res: Response) =>
  getDiscountController.execute(req, res),
);

router.post('/', (req: Request, res: Response) => createDiscountController.execute(req, res));

router.put('/:discountId', (req: Request, res: Response) =>
  updateDiscountController.execute(req, res),
);
router.put('/:discountId/deactivate', (req: Request, res: Response) =>
  deactivateDiscountController.execute(req, res),
);

router.delete('/:discountId', (req: Request, res: Response) =>
  deleteDiscountController.execute(req, res),
);
// router.delete('/', (req: Request, res: Response) =>
//   deleteDiscountsBulkController.execute(req, res),
// );

export default router;
