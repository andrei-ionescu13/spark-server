import { ProductModel } from '../../../../../product/model';
import { ProductRepo } from '../../../../../product/productRepo';
import { CloudinaryUploaderService } from '../../../../services/uploaderService';
import { PlatformModel } from '../../model';
import { PlatformCommandsRepo } from '../../repo/commands';
import { PlatformQueriesRepo } from '../../repo/queries';
import { DeletePlatformController } from './deletePlatformController';
import { DeletePlatformUseCase } from './deletePlatformUseCase';

const platformCommandsRepo = new PlatformCommandsRepo(PlatformModel);
const platformQueriesRepo = new PlatformQueriesRepo(PlatformModel);
const productRepo = new ProductRepo(ProductModel);

const uploaderService = new CloudinaryUploaderService();

const deletePlatformUseCase = new DeletePlatformUseCase(
  platformCommandsRepo,
  platformQueriesRepo,
  productRepo,
  uploaderService,
);

export const deletePlatformController = new DeletePlatformController(deletePlatformUseCase);
