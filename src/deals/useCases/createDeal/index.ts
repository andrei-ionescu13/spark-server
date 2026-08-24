import { CloudinaryUploaderService } from '../../../services/uploaderService';
import { DealModel } from '../../model';
import { DealCommandsRepo } from '../../repo/commands';
import { CreateDealController } from './createDealController';
import { CreateDealUseCase } from './createDealUseCase';

const dealCommandsRepo = new DealCommandsRepo(DealModel);

const uploaderService = new CloudinaryUploaderService();

const createDealUseCase = new CreateDealUseCase(dealCommandsRepo, uploaderService);
export const createDealController = new CreateDealController(createDealUseCase);
