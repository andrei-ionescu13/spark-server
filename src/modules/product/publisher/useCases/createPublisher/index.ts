import { Mongo } from '../../../../../mongo';
import { CloudinaryUploaderService } from '../../../../../services/uploaderService';
import { PublisherCommandsRepo } from '../../repo/commands';
import { CreatePublisherController } from './createPublisherController';
import { CreatePublisherUseCase } from './createPublisherUseCase';

const publisherCommandsRepo = new PublisherCommandsRepo(Mongo.getCollection('publishers'));
const uploaderService = new CloudinaryUploaderService();
const createPublisherUseCase = new CreatePublisherUseCase(publisherCommandsRepo, uploaderService);
export const createPublisherController = new CreatePublisherController(createPublisherUseCase);
