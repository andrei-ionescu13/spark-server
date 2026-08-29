import { KeyCommandsRepo } from '../../../key/repo/commands';
import { KeyQueriesRepo } from '../../../key/repo/queries';
import { Mongo } from '../../../../mongo';
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

const productCommandsRepo = new ProductCommandsRepo(Mongo.getCollection('products'));
const productQueriesRepo = new ProductQueriesRepo(Mongo.getCollection('products'));
const genreQueriesRepo = new GenreQueriesRepo(Mongo.getCollection('genres'));
const publisherQueriesRepo = new PublisherQueriesRepo(Mongo.getCollection('publishers'));
const developerQueriesRepo = new DeveloperQueriesRepo(Mongo.getCollection('developers'));
const featureQueriesRepo = new FeatureQueriesRepo(Mongo.getCollection('features'));
const operatingSystemQueriesRepo = new OperatingSystemQueriesRepo(
  Mongo.getCollection('operating_systems'),
);
const keyCommandsRepo = new KeyCommandsRepo(Mongo.getCollection('keys'));
const keyQueriesRepo = new KeyQueriesRepo(Mongo.getCollection('keys'));
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
