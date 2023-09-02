import { ProductModel } from '../../../product/model';
import { ProductRepo } from '../../../product/productRepo';
import { OperatingSystemModel } from '../../model';
import { OperatingSystemRepo } from '../../operatingSystemRepo';
import { DeleteOperatingSystemsBulkUseCase } from './deleteOperatingSystemsBulkUseCase';
import { DeleteOperatingSystemsBulkController } from './deleteOperatingSystemsBulkController';

const operatingSystemRepo = new OperatingSystemRepo(OperatingSystemModel);
const productRepo = new ProductRepo(ProductModel);
const deleteOperatingSystemsBulkUseCase = new DeleteOperatingSystemsBulkUseCase(
  operatingSystemRepo,
  productRepo,
);
export const deleteOperatingSystemsBulkController = new DeleteOperatingSystemsBulkController(
  deleteOperatingSystemsBulkUseCase,
);
