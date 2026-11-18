import { CloudinaryUploaderService } from '../../../../services/uploaderService';
import { DeveloperQueriesRepo } from '../../developer/repo/queries';
import { FeatureQueriesRepo } from '../../feature/repo/queries';
import { GenreQueriesRepo } from '../../genre/repo/queries';
import { OperatingSystemQueriesRepo } from '../../operatingSystem/repo/queries';
import { PublisherQueriesRepo } from '../../publisher/repo/queries';
import { ProductCommandsRepo } from '../../repo/commands';
import { ProductQueriesRepo } from '../../repo/queries';
import { CreateProductController } from './createProductController';
import { CreateProductUseCase } from './createProductUseCase';

const productCommandsRepo = new ProductCommandsRepo();
const productQueriesRepo = new ProductQueriesRepo();
const genreQueriesRepo = new GenreQueriesRepo();
const publisherQueriesRepo = new PublisherQueriesRepo();
const developerQueriesRepo = new DeveloperQueriesRepo();
const featureQueriesRepo = new FeatureQueriesRepo();
const operatingSystemQueriesRepo = new OperatingSystemQueriesRepo();
const uploaderService = new CloudinaryUploaderService();

const createProductUseCase = new CreateProductUseCase(
  productCommandsRepo,
  productQueriesRepo,
  genreQueriesRepo,
  publisherQueriesRepo,
  developerQueriesRepo,
  featureQueriesRepo,
  operatingSystemQueriesRepo,
  uploaderService,
);
export const createProductController = new CreateProductController(createProductUseCase);
