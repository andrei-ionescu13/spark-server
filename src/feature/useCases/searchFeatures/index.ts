import { FeatureRepo } from '../../featureRepo';
import { FeatureModel } from '../../model';
import { SearchArticleCategoriesController } from './searchFeaturesController';
import { SearchArticleCategoriesUseCase } from './searchFeaturesUseCase';

const featureRepo = new FeatureRepo(FeatureModel);
const searchArticleCategoriesUseCase = new SearchArticleCategoriesUseCase(featureRepo);
export const searchArticleCategoriesController = new SearchArticleCategoriesController(
  searchArticleCategoriesUseCase,
);
