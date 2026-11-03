import { Mongo } from '../../../../../mongo';
import { CloudinaryUploaderService } from '../../../../../services/uploaderService';
import { PublisherCommandsRepo } from '../../repo/commands';
import { UpdatePublisherController } from './updatePublisherController';
import { UpdatePublisherUseCase } from './updatePublisherUseCase';

const publisherCommandsRepo = new PublisherCommandsRepo(Mongo.getCollection('publishers'));

const uploaderService = new CloudinaryUploaderService();

const updatePublisherUseCase = new UpdatePublisherUseCase(publisherCommandsRepo, uploaderService);
export const updatePublisherController = new UpdatePublisherController(updatePublisherUseCase);
