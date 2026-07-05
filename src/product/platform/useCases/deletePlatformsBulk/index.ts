import { CloudinaryUploaderService } from '../../../../services/uploaderService';
import { ProductModel } from '../../../model';
import { ProductRepo } from '../../../productRepo';
import { PlatformModel } from '../../model';
import { PlatformCommandsRepo } from '../../repo/commands';
import { PlatformQueriesRepo } from '../../repo/queries';
import { DeletePlatformsBulkController } from './deletePlatformsBulkController';
import { DeletePlatformsBulkUseCase } from './deletePlatformsBulkUseCase';

const platformCommandsRepo = new PlatformCommandsRepo(PlatformModel);
const platformQueriesRepo = new PlatformQueriesRepo(PlatformModel);
const productRepo = new ProductRepo(ProductModel);

const uploaderService = new CloudinaryUploaderService();

const deletePlatformsBulkUseCase = new DeletePlatformsBulkUseCase(
  platformCommandsRepo,
  platformQueriesRepo,
  productRepo,
  uploaderService,
);
export const deletePlatformsBulkController = new DeletePlatformsBulkController(
  deletePlatformsBulkUseCase,
);
