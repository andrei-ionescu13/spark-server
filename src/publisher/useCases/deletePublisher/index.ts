import { ProductModel } from '../../../product/model';
import { ProductRepo } from '../../../product/productRepo';
import { CloudinaryUploaderService } from '../../../services/uploaderService';
import { PublisherModel } from '../../model';
import { PublisherRepo } from '../../publisherRepo';
import { DeletePublisherController } from './deletePublisherController';
import { DeletePublisherUseCase } from './deletePublisherUseCase';

const publisherRepo = new PublisherRepo(PublisherModel);
const productRepo = new ProductRepo(ProductModel);

const uploaderService = new CloudinaryUploaderService();

const deletePublisherUseCase = new DeletePublisherUseCase(
  publisherRepo,
  productRepo,
  uploaderService,
);
export const deletePublisherController = new DeletePublisherController(deletePublisherUseCase);
