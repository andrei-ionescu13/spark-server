import express, { Request, Response } from 'express';
import { createCouponController } from './useCases/createCoupon';
import { deactivateCouponController } from './useCases/deactivateCoupon';
import { deleteCouponController } from './useCases/deleteCoupon';
import { getCouponController } from './useCases/getCoupon';
import { searchCouponsController } from './useCases/searchCoupons';
import { updateCouponController } from './useCases/updateCoupon';
import { deleteCouponsBulkController } from './useCases/deleteCouponsBulk';
const router = express.Router();

router.get('/search', (req: Request, res: Response) => searchCouponsController.execute(req, res));
router.get('/:couponId', (req: Request, res: Response) => getCouponController.execute(req, res));

router.post('/', (req: Request, res: Response) => createCouponController.execute(req, res));

router.put('/:couponId', (req: Request, res: Response) => updateCouponController.execute(req, res));
router.put('/:couponId/deactivate', (req: Request, res: Response) =>
  deactivateCouponController.execute(req, res),
);

router.delete('/:couponId', (req: Request, res: Response) =>
  deleteCouponController.execute(req, res),
);
router.delete('/', (req: Request, res: Response) => deleteCouponsBulkController.execute(req, res));

export default router;
