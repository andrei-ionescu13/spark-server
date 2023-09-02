import { DeveloperRepo } from '../../../developer/developerRepo';
import { DeveloperModel } from '../../../developer/model';
import { FeatureRepo } from '../../../feature/featureRepo';
import { FeatureModel } from '../../../feature/model';
import { GenreRepo } from '../../../genre/genreRepo';
import { GenreModel } from '../../../genre/model';
import { KeyRepo } from '../../../key/keyRepo';
import { KeyModel } from '../../../key/model';
import { LanguageRepo } from '../../../language/languageRepo';
import { LanguageModel } from '../../../language/model';
import { OperatingSystemModel } from '../../../operating-system/model';
import { OperatingSystemRepo } from '../../../operating-system/operatingSystemRepo';
import { PublisherModel } from '../../../publisher/model';
import { PublisherRepo } from '../../../publisher/publisherRepo';
import { CloudinaryUploaderService } from '../../../services/uploaderService';
import { ProductModel } from '../../model';
import { ProductRepo } from '../../productRepo';
import { CreateProductController } from './createProductController';
import { CreateProductUseCase } from './createProductUseCase';

const productRepo = new ProductRepo(ProductModel);
const genreRepo = new GenreRepo(GenreModel);
const publisherRepo = new PublisherRepo(PublisherModel);
const keyRepo = new KeyRepo(KeyModel);
const developerRepo = new DeveloperRepo(DeveloperModel);
const featureRepo = new FeatureRepo(FeatureModel);
const operatingSystemRepo = new OperatingSystemRepo(OperatingSystemModel);
const languageRepo = new LanguageRepo(LanguageModel);

const uploaderService = new CloudinaryUploaderService();

const createProductUseCase = new CreateProductUseCase(
  productRepo,
  genreRepo,
  publisherRepo,
  developerRepo,
  featureRepo,
  operatingSystemRepo,
  languageRepo,
  keyRepo,
  uploaderService,
);
export const createProductController = new CreateProductController(createProductUseCase);
