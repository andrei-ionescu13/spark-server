import { CloudinaryUploaderService } from '../../../services/uploaderService';
import { DealRepo } from '../../dealRepo';
import { DealModel } from '../../model';
import { DeleteDealController } from './deleteDealController';
import { DeleteDealUseCase } from './deleteDealUseCase';

const dealRepo = new DealRepo(DealModel);

const uploaderService = new CloudinaryUploaderService();

const deleteDealUseCase = new DeleteDealUseCase(dealRepo, uploaderService);
export const deleteDealController = new DeleteDealController(deleteDealUseCase);
