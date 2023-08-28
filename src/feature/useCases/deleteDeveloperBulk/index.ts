import { ProductModel } from '../../../product/model';
import { ProductRepo } from '../../../product/productRepo';
import { FeatureRepo } from '../../featureRepo';
import { FeatureModel } from '../../model';
import { DeleteFeatureBulkController } from './deleteFeatureBulkController';
import { DeleteFeatureBulkUseCase } from './deleteFeatureBulkUseCase';

const productRepo = new ProductRepo(ProductModel);
const featureRepo = new FeatureRepo(FeatureModel);
const deleteFeatureBulkUseCase = new DeleteFeatureBulkUseCase(productRepo, featureRepo);
export const deleteFeatureBulkController = new DeleteFeatureBulkController(
  deleteFeatureBulkUseCase,
);
