import { DealRepo } from '../../dealRepo';
import { DealModel } from '../../model';
import { SearchDealsController } from './searchDealsController';
import { SearchDealsUseCase } from './searchDealsUseCase';

const dealRepo = new DealRepo(DealModel);
const searchDealsUseCase = new SearchDealsUseCase(dealRepo);
export const searchDealsController = new SearchDealsController(searchDealsUseCase);
