import { ProductModel } from '../../../product/model';
import { ProductRepo } from '../../../product/productRepo';
import { FeatureRepo } from '../../featureRepo';
import { FeatureModel } from '../../model';
import { DeleteFeatureController } from './deleteFeatureController';
import { DeleteFeatureUseCase } from './deleteFeatureUseCase';

const productRepo = new ProductRepo(ProductModel);
const featureRepo = new FeatureRepo(FeatureModel);

const deleteFeatureUseCase = new DeleteFeatureUseCase(productRepo, featureRepo);
export const deleteFeatureController = new DeleteFeatureController(deleteFeatureUseCase);
