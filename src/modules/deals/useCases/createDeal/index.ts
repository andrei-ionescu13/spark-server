import { Mongo } from '../../../../mongo';
import { CloudinaryUploaderService } from '../../../../services/uploaderService';
import { DealCommandsRepo } from '../../repo/commands';
import { CreateDealController } from './createDealController';
import { CreateDealUseCase } from './createDealUseCase';

const dealCommandsRepo = new DealCommandsRepo(Mongo.getCollection('deals'));

const uploaderService = new CloudinaryUploaderService();

const createDealUseCase = new CreateDealUseCase(dealCommandsRepo, uploaderService);
export const createDealController = new CreateDealController(createDealUseCase);
