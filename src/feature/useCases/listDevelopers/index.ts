import { FeatureRepo } from '../../featureRepo';
import { FeatureModel } from '../../model';
import { ListFeaturesController } from './listFeaturesController';
import { ListFeaturesUseCase } from './listFeaturesUseCase';

const featureRepo = new FeatureRepo(FeatureModel);
const listFeaturesUseCase = new ListFeaturesUseCase(featureRepo);
export const listFeaturesController = new ListFeaturesController(listFeaturesUseCase);
