import { CloudinaryUploaderService } from '../../../../services/uploaderService';
import { PublisherModel } from '../../model';
import { PublisherCommandsRepo } from '../../repo/commands';
import { UpdatePublisherController } from './updatePublisherController';
import { UpdatePublisherUseCase } from './updatePublisherUseCase';

const publisherCommandsRepo = new PublisherCommandsRepo(PublisherModel);

const uploaderService = new CloudinaryUploaderService();

const updatePublisherUseCase = new UpdatePublisherUseCase(publisherCommandsRepo, uploaderService);
export const updatePublisherController = new UpdatePublisherController(updatePublisherUseCase);
