import { CloudinaryUploaderService } from '../../../../services/uploaderService';
import { ProductModel } from '../../../model';
import { ProductRepo } from '../../../productRepo';
import { PublisherModel } from '../../model';
import { PublisherCommandsRepo } from '../../repo/commands';
import { PublisherQueriesRepo } from '../../repo/queries';
import { DeletePublisherController } from './deletePublisherController';
import { DeletePublisherUseCase } from './deletePublisherUseCase';

const publisherCommandsRepo = new PublisherCommandsRepo(PublisherModel);
const publisherQueriesRepo = new PublisherQueriesRepo(PublisherModel);
const productRepo = new ProductRepo(ProductModel);

const uploaderService = new CloudinaryUploaderService();

const deletePublisherUseCase = new DeletePublisherUseCase(
  publisherCommandsRepo,
  publisherQueriesRepo,
  productRepo,
  uploaderService,
);

export const deletePublisherController = new DeletePublisherController(deletePublisherUseCase);
