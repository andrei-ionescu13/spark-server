import { CloudinaryUploaderService } from '../../../services/uploaderService';
import { DealRepo } from '../../dealRepo';
import { DealModel } from '../../model';
import { CreateDealController } from './createDealController';
import { CreateDealUseCase } from './createDealUseCase';

const dealRepo = new DealRepo(DealModel);

const uploaderService = new CloudinaryUploaderService();

const createDealUseCase = new CreateDealUseCase(dealRepo, uploaderService);
export const createDealController = new CreateDealController(createDealUseCase);
