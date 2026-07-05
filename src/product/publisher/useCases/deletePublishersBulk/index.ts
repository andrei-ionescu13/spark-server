import { CloudinaryUploaderService } from '../../../../services/uploaderService';
import { ProductModel } from '../../../model';
import { ProductRepo } from '../../../productRepo';
import { PublisherModel } from '../../model';
import { PublisherCommandsRepo } from '../../repo/commands';
import { PublisherQueriesRepo } from '../../repo/queries';
import { DeletePublishersBulkController } from './deletePublishersBulkController';
import { DeletePublishersBulkUseCase } from './deletePublishersBulkUseCase';

const publisherCommandsRepo = new PublisherCommandsRepo(PublisherModel);
const publisherQueriesRepo = new PublisherQueriesRepo(PublisherModel);
const productRepo = new ProductRepo(ProductModel);

const uploaderService = new CloudinaryUploaderService();

const deletePublishersBulkUseCase = new DeletePublishersBulkUseCase(
  publisherCommandsRepo,
  publisherQueriesRepo,
  productRepo,
  uploaderService,
);
export const deletePublishersBulkController = new DeletePublishersBulkController(
  deletePublishersBulkUseCase,
);
