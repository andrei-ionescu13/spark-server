import { CloudinaryUploaderService } from '../../../services/uploaderService';
import { DealRepo } from '../../dealRepo';
import { DealModel } from '../../model';
import { UpdateDealController } from './updateDealController';
import { UpdateDealUseCase } from './updateDealUseCase';

const dealRepo = new DealRepo(DealModel);

const uploaderService = new CloudinaryUploaderService();

const updateDealUseCase = new UpdateDealUseCase(dealRepo, uploaderService);
export const updateDealController = new UpdateDealController(updateDealUseCase);
