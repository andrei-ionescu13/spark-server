import express, { Request, Response } from 'express';
import { addCurrencyController } from './useCases/addCurrency';
import { searchCurrenciesController } from './useCases/searchCurrencies';
import { deleteCurrencyController } from './useCases/deleteCurrency';
const router = express.Router();

router.post('/', (req: Request, res: Response) => addCurrencyController.execute(req, res));
router.get('/search', (req: Request, res: Response) =>
  searchCurrenciesController.execute(req, res),
);
router.delete('/:currencyId', (req: Request, res: Response) =>
  deleteCurrencyController.execute(req, res),
);

export default router;
