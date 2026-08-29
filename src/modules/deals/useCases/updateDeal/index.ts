import { Mongo } from '../../../../mongo';
import { CloudinaryUploaderService } from '../../../../services/uploaderService';
import { DealCommandsRepo } from '../../repo/commands';
import { UpdateDealController } from './updateDealController';
import { UpdateDealUseCase } from './updateDealUseCase';

const dealCommandsRepo = new DealCommandsRepo(Mongo.getCollection('deals'));

const uploaderService = new CloudinaryUploaderService();

const updateDealUseCase = new UpdateDealUseCase(dealCommandsRepo, uploaderService);
export const updateDealController = new UpdateDealController(updateDealUseCase);
