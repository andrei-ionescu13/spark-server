import express from 'express';
import type { Request, Response } from 'express';
import { searchOrdersController } from './useCases/searchOrders';
import { getOrderController } from './useCases/getOrder';
import { listOrderItemsController } from './useCases/listOrderItems';
const router = express.Router();

router.get('/search', (req: Request, res: Response) => searchOrdersController.execute(req, res));
router.get('/:orderNumber', (req: Request, res: Response) => getOrderController.execute(req, res));
router.get('/:orderNumber/items', (req: Request, res: Response) =>
  listOrderItemsController.execute(req, res),
);

export default router;
