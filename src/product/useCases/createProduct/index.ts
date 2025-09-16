import { KeyModel } from '../../../key/model';
import { KeyCommandsRepo } from '../../../key/repo/commands';
import { KeyQueriesRepo } from '../../../key/repo/queries';
import { CloudinaryUploaderService } from '../../../services/uploaderService';
import { DeveloperModel } from '../../developer/model';
import { DeveloperQueriesRepo } from '../../developer/repo/queries';
import { FeatureModel } from '../../feature/model';
import { FeatureQueriesRepo } from '../../feature/repo/queries';
import { GenreModel } from '../../genre/model';
import { GenreQueriesRepo } from '../../genre/repo/queries';
import { ProductModel } from '../../model';
import { OperatingSystemModel } from '../../operatingSystem/model';
import { OperatingSystemQueriesRepo } from '../../operatingSystem/repo/queries';
import { PublisherModel } from '../../publisher/model';
import { PublisherQueriesRepo } from '../../publisher/repo/queries';
import { ProductCommandsRepo } from '../../repo/commands';
import { ProductQueriesRepo } from '../../repo/queries';
import { CreateProductController } from './createProductController';
import { CreateProductUseCase } from './createProductUseCase';

const productCommandsRepo = new ProductCommandsRepo(ProductModel);
const productQueriesRepo = new ProductQueriesRepo(ProductModel);
const genreQueriesRepo = new GenreQueriesRepo(GenreModel);
const publisherQueriesRepo = new PublisherQueriesRepo(PublisherModel);
const developerQueriesRepo = new DeveloperQueriesRepo(DeveloperModel);
const featureQueriesRepo = new FeatureQueriesRepo(FeatureModel);
const operatingSystemQueriesRepo = new OperatingSystemQueriesRepo(OperatingSystemModel);
const keyCommandsRepo = new KeyCommandsRepo(KeyModel);
const keyQueriesRepo = new KeyQueriesRepo(KeyModel);
const uploaderService = new CloudinaryUploaderService();

const createProductUseCase = new CreateProductUseCase(
  productCommandsRepo,
  productQueriesRepo,
  genreQueriesRepo,
  publisherQueriesRepo,
  developerQueriesRepo,
  featureQueriesRepo,
  operatingSystemQueriesRepo,
  keyCommandsRepo,
  keyQueriesRepo,
  uploaderService,
);
export const createProductController = new CreateProductController(createProductUseCase);
