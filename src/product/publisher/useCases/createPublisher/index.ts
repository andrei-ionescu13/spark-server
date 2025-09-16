import { CloudinaryUploaderService } from '../../../../services/uploaderService';
import { PublisherModel } from '../../model';
import { PublisherCommandsRepo } from '../../repo/commands';
import { CreatePublisherController } from './createPublisherController';
import { CreatePublisherUseCase } from './createPublisherUseCase';

const publisherCommandsRepo = new PublisherCommandsRepo(PublisherModel);
const uploaderService = new CloudinaryUploaderService();
const createPublisherUseCase = new CreatePublisherUseCase(publisherCommandsRepo, uploaderService);
export const createPublisherController = new CreatePublisherController(createPublisherUseCase);
