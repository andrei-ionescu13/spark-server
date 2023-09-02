import { ProductModel } from '../../../product/model';
import { ProductRepo } from '../../../product/productRepo';
import { OperatingSystemRepo } from '../../operatingSystemRepo';
import { OperatingSystemModel } from '../../model';
import { DeleteOperatingSystemController } from './deleteOperatingSystemController';
import { DeleteOperatingSystemUseCase } from './deleteOperatingSystemUseCase';

const operatingSystemRepo = new OperatingSystemRepo(OperatingSystemModel);
const productRepo = new ProductRepo(ProductModel);
const deleteOperatingSystemUseCase = new DeleteOperatingSystemUseCase(
  operatingSystemRepo,
  productRepo,
);
export const deleteOperatingSystemController = new DeleteOperatingSystemController(
  deleteOperatingSystemUseCase,
);
