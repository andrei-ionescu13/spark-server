import { ProductModel } from '../../../product/model';
import { ProductRepo } from '../../../product/productRepo';
import { CloudinaryUploaderService } from '../../../services/uploaderService';
import { PublisherModel } from '../../model';
import { PublisherRepo } from '../../publisherRepo';
import { DeletePublishersBulkController } from './deletePublishersBulkController';
import { DeletePublishersBulkUseCase } from './deletePublishersBulkUseCase';

const publisherRepo = new PublisherRepo(PublisherModel);
const productRepo = new ProductRepo(ProductModel);

const uploaderService = new CloudinaryUploaderService();

const deletePublishersBulkUseCase = new DeletePublishersBulkUseCase(
  publisherRepo,
  productRepo,
  uploaderService,
);
export const deletePublishersBulkController = new DeletePublishersBulkController(
  deletePublishersBulkUseCase,
);
